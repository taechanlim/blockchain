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
