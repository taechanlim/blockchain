import { Block } from './block';
import { DIFFICULTY_ADJUSTMENT_INTERVAL } from '@core/config';

export class Chain {
    public blockchain: Block[];

    constructor() {
        this.blockchain = [Block.getGENESIS()];
    }

    public getChain(): Block[] {
        return this.blockchain;
    }

    public getLength(): number {
        return this.blockchain.length;
    }

    public getLatestBlock(): Block {
        return this.blockchain[this.blockchain.length - 1];
    }

    public addBlock(data: string[]): Failable<Block, string> {
        // TODO 내가 앞으로 생성할 블럭의 높이값을 가져올수 있는가?
        // 현재 높이값 - block interval  = 음수값
        // 난이도를 구해야함
        // 생성시간을 구하는것이 1차목표
        const previousBlock = this.getLatestBlock();
        const adjustmentBlock: Block = this.getAdjustmentBlock(); //높이가 -10짜리 블럭만 가져오는함수
        const newBlock = Block.generateBlock(previousBlock, data, adjustmentBlock);
        const isValid = Block.isValidNewBlock(newBlock, previousBlock);

        if (isValid.isError) return { isError: true, error: isValid.error };

        this.blockchain.push(newBlock);

        return { isError: false, value: newBlock };
    }
    public addToChain(_receivedBlock: Block): Failable<undefined, string> {
        const isValid = Block.isValidNewBlock(_receivedBlock, this.getLatestBlock());
        if (isValid.isError) return { isError: true, error: isValid.error };

        this.blockchain.push(_receivedBlock);
        return { isError: false, value: undefined };
    }

    public isValidChain(_chain: Block[]): Failable<undefined, string> {
        //제네시스블록을 검사하는 코드가 들어가면됨
        const genesis = _chain[0];

        //나머지 체인에대한 코드부분
        for (let i = 1; i < _chain.length; i++) {
            const newBlock = _chain[i];
            const previousBlock = _chain[i - 1];
            const isValid = Block.isValidNewBlock(newBlock, previousBlock);
            if (isValid.isError) return { isError: true, error: isValid.error };
        }

        return { isError: false, value: undefined };
    }

    public replaceChain(receivedChain: Block[]): Failable<undefined, string> {
        //내 체인과 상대방 체인에 대해서 검사
        //1.'받은 체인의 길이 === 0' (이러면 제네시스밖에없다는 뜻,내 체인이 더 길다) 면 return
        //2.'받은 체인의 최신블록의 높이 < 내 체인의 최신블록의 높이' 면 return
        //3.'받은 체인의 최신블록의 이전 해시 === 내 체인의 최신블록의 해시' 면 return
        // 위 3조건이 충족이 안되면 내 체인이 더 짧다는 의미(내 체인을 상대꺼로 바꿔야함)

        const lastestReceivedBlock: Block = receivedChain[receivedChain.length - 1]; //->상대체인의 최신블럭
        const lastestBlock: Block = this.getLatestBlock(); //->내체인의 최신블럭

        if (lastestReceivedBlock.height === 0) {
            return { isError: true, error: '받은 최신블록이 제네시스블록입니다' };
        }
        if (lastestReceivedBlock.height <= lastestBlock.height) {
            return { isError: true, error: '자신의 체인길이가 더 길거나 같습니다' };
        }
        if (lastestReceivedBlock.previousHash === lastestBlock.hash) {
            //addToChain()
            return { isError: true, error: '블록이 하나만큼 모자랍니다' };
        }

        //체인을 바꿔주는 코드를 작성.
        this.blockchain = receivedChain;

        return { isError: false, value: undefined };
    }

    //getAdjustmentBlock
    //생성기준으로 블럭높이가 -10 짜리 구해오기
    public getAdjustmentBlock() {
        //현재 마지막블럭에서 -10 (DIFFICULTY_ADJUSTMENT_INTERVAL)
        const currentLength = this.getLength();
        const adjustmentBlock: Block =
            currentLength < DIFFICULTY_ADJUSTMENT_INTERVAL
                ? Block.getGENESIS()
                : this.blockchain[currentLength - DIFFICULTY_ADJUSTMENT_INTERVAL];
        return adjustmentBlock; //블럭자체를 반환
    }
}
