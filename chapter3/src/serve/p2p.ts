// 1. 서버  2. 클라이언트 ///

import { WebSocket } from 'ws';
import { Chain } from '@core/blockchain/chain';

enum MessageType {
    //enum : interface에 특정 값만 넣고싶을때 ex)gender -> '남자' / '여자'
    latest_block = 0,
    all_block = 1,
    receivedChain = 2,
}

interface Message {
    type: MessageType;
    payload: any;
}

export class P2PServer extends Chain {
    private sockets: WebSocket[];

    constructor() {
        super();
        this.sockets = [];
    }

    getSockets() {
        return this.sockets;
    }

    //서버시작 실행코드
    listen() {
        const server = new WebSocket.Server({ port: 7545 });
        server.on('connection', (socket) => {
            console.log(` websocket connection `);
            this.connectSocket(socket);
        });
    }

    //client 연결코드
    connectTopeer(newPeer: string) {
        const socket = new WebSocket(newPeer);
        socket.on('open', () => {
            this.connectSocket(socket);
        });
    }

    connectSocket(socket: WebSocket) {
        this.sockets.push(socket);
        this.messageHandler(socket);

        const data: Message = {
            type: MessageType.latest_block,
            payload: {},
        };

        this.errorHandler(socket);

        const send = this.send(socket);
        send(data);
        //this.send(socket)(data)
    }

    messageHandler(socket: WebSocket) {
        const callback = (data: string) => {
            const result: Message = P2PServer.dataParse<Message>(data);

            const send = this.send(socket);
            // const block: IBlock = message.payload;

            // console.log('블럭 콘솔 테스트', block);

            switch (result.type) {
                case MessageType.latest_block: {
                    const message: Message = {
                        type: MessageType.all_block,
                        payload: [this.getLatestBlock()],
                    };
                    send(message);
                    break;
                }
                case MessageType.all_block: {
                    const message: Message = {
                        type: MessageType.receivedChain,
                        payload: this.getChain(),
                    };

                    //블록검증이후 내 체인에 블럭을 넣을지말지
                    //내 최신블럭과 다른이에게 받은 블럭을 비교해서 이상없을시 내 체인에 블럭추가
                    //내 hash와 상대블럭의 previoushash값이 같으면
                    //내 체인에 상대방 블럭을 넣으면된다.

                    const [receivedBlock] = result.payload;
                    const isValid = this.addToChain(receivedBlock);

                    // addToChain이 성공하면 굳이 체인을 안불러와도되서 break
                    if (!isValid.isError) break;

                    send(message); //체인을 요청하는 코드
                    break;
                }

                case MessageType.receivedChain: {
                    const receivedChain: IBlock[] = result.payload;
                    console.log(receivedChain);
                    //체인 바꿔주는 코드
                    //긴체인 선택하기
                    this.handleChainResponse(receivedChain);

                    break;
                }
            }
        };
        socket.on('message', callback);
    }

    errorHandler(socket: WebSocket) {
        const close = () => {
            this.sockets.splice(this.sockets.indexOf(socket), 1);
        };
        socket.on('close', close);
        socket.on('error', close);
    }

    send(_socket: WebSocket) {
        return (_data: Message) => {
            _socket.send(JSON.stringify(_data));
        };
    }

    broadcast(message: Message): void {
        this.sockets.forEach((socket) => this.send(socket)(message));
    }

    handleChainResponse(receivedChain: IBlock[]): Failable<Message | undefined, string> {
        //전달받은 체인이 올바른가?
        const isValidChain = this.isValidChain(receivedChain);
        if (isValidChain.isError) return { isError: true, error: isValidChain.error };

        //내 체인과 상대방 체인에 대해서 검사
        //1.'받은 체인의 길이 === 0' (이러면 제네시스밖에없다는 뜻,내 체인이 더 길다) 면 return
        //2.'받은 체인의 최신블록의 높이 < 내 체인의 최신블록의 높이' 면 return
        //3.'받은 체인의 최신블록의 이전 해시 === 내 체인의 최신블록의 해시' 면 return
        // 위 3조건이 충족이 안되면 내 체인이 더 짧다는 의미(내 체인을 상대꺼로 바꿔야함)

        const isValid = this.replaceChain(receivedChain);
        if (isValid.isError) return { isError: true, error: isValid.error };

        //broadcast
        const message: Message = {
            type: MessageType.receivedChain,
            payload: receivedChain,
        };
        this.broadcast(message);

        return { isError: false, value: undefined };
    }

    static dataParse<T>(_data: string): T {
        return JSON.parse(Buffer.from(_data).toString());
    }
}
