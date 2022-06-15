import { Block } from '@core/blockchain/block';
import { GENESIS } from '@core/config';

describe('Block 검증', () => {
    /*
        어차피 제네시스블록은 하드코딩한 값이다.
    */
    let newBlock: Block;

    it('블록생성', () => {
        const data = ['Block #2'];
        newBlock = Block.generateBlock(GENESIS, data, GENESIS);
        const newBlock2 = new Block(newBlock, data);
        // console.log(newBlock);
        // console.log(newBlock2);
    });

    it('블록검증 테스트', () => {
        try {
            const isValidBlock = Block.isValidNewBlock(newBlock, GENESIS); //{isError:boolean}
            if (isValidBlock.isError) throw new Error(isValidBlock.error);
            console.log(isValidBlock.value);
            expect(isValidBlock.isError).toBe(false);
        } catch (e) {
            if (e instanceof Error) console.error(e.message);
            expect(false).toBe(true);
        }
    });
});
