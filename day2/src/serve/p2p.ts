// 1. 서버  2. 클라이언트 //

import { WebSocket } from 'ws';
import { Chain } from '@core/blockchain/chain';

enum MessageType {
    //enum : interface에 특정 값만 넣고싶을때 ex)gender -> '남자' / '여자'
    latest_block = 0,
    all_block = 1,
    receiveChain = 2,
}

interface Message {
    type: MessageType;
    payload: any;
}

export class P2PServer extends Chain {
    public sockets: WebSocket[];

    constructor() {
        super();
        this.sockets = [];
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

        const send = this.send(socket);
        send(data);
    }

    messageHandler(socket: WebSocket) {
        const callback = (data: string) => {
            const message: Message = P2PServer.dataParse<Message>(data);

            const send = this.send(socket);
            // const block: IBlock = message.payload;

            // console.log('블럭 콘솔 테스트', block);

            switch (message.type) {
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
                        type: MessageType.receiveChain,
                        payload: this.getChain(),
                    };
                    //블록검증이후 블럭을 넣을지말지
                    send(message);
                    break;
                }

                case MessageType.receiveChain: {
                    const receiveChain: IBlock[] = message.payload;
                    console.log(receiveChain);
                    //체인 바꿔주는 코드
                    break;
                }
            }
        };
        socket.on('message', callback);
    }

    send(_socket: WebSocket) {
        return (_data: Message) => {
            _socket.send(JSON.stringify(_data));
        };
    }

    static dataParse<T>(_data: string): T {
        return JSON.parse(Buffer.from(_data).toString());
    }
}
