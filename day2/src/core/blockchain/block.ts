//crypto-js
//merkle

import { SHA256 } from 'crypto-js';
import merkle from 'merkle';
import { BlockHeader } from './blockHeader';
import { BLOCK_GENERATION_INTERVAL, DIFFICULTY_ADJUSTMENT_INTERVAL, GENESIS, UNIT } from '@core/config';
import hexToBinary from 'hex-to-binary';
// export class BlockHeader {
//     public version: string;
//     public height: number;
//     public timestamp: number;
//     public previousHash: string;

//     constructor(_previousBlock: Block) {
//         this.version = BlockHeader.getVersion();
//         this.timestamp = BlockHeader.getTimestamp();
//         this.height = _previousBlock.height + 1;
//         this.previousHash = _previousBlock.hash;
//     }

//     public static getVersion() {
//         return '1.0.0';
//     }

//     public static getTimestamp() {
//         return new Date().getTime();
//     }
// }

//extends : 상속 (그대로 가져오는 느낌)
export class Block extends BlockHeader implements IBlock {
    public hash: string;
    public merkleRoot: string;
    public nonce: number;
    public difficulty: number;
    public data: string[];
    // super : 자식의 constructor를 바로 사용가능하게 해주는 기능
    constructor(_previousBlock: Block, _data: string[], _adjustmentBlock: Block = _previousBlock) {
        super(_previousBlock);

        const merkleRoot = Block.getMerkleRoot(_data);

        this.merkleRoot = merkleRoot;
        this.hash = Block.createBlockHash(this);
        this.nonce = 0;
        this.difficulty = Block.getDifficulty(_previousBlock, _adjustmentBlock, _previousBlock);
        this.data = _data;
    }

    public static getGENESIS(): Block {
        return GENESIS;
    }

    public static getMerkleRoot<T>(_data: T[]): string {
        const merkleTree = merkle('sha256').sync(_data);
        return merkleTree.root() || '0'.repeat(64);
    }

    public static createBlockHash(_block: Block): string {
        const { version, timestamp, merkleRoot, previousHash, height, difficulty, nonce } = _block;
        const values: string = `${version}${timestamp}${merkleRoot}${previousHash}${height}${difficulty}${nonce}`;
        return SHA256(values).toString();
    }

    //                                  제네시스                                제네시스
    public static generateBlock(_previousBlock: Block, _data: string[], _adjustmentBlock: Block): Block {
        const generateBlock = new Block(_previousBlock, _data, _adjustmentBlock);

        //newBlock은 마이닝 완료된 블럭
        const newBlock = Block.findBlock(generateBlock);
        return newBlock;
    }

    public static findBlock(_generateBlock: Block): Block {
        //마이닝 작업코드를 넣어야함
        // _generateBlock.hash; //->2진수로 바꿔야함
        // hexToBinary(_generateBlock.hash);
        let nonce: number = 0;
        let hash: string;
        while (true) {
            nonce++;
            _generateBlock.nonce = nonce;
            hash = Block.createBlockHash(_generateBlock);
            const binary: string = hexToBinary(hash);
            const result: boolean = binary.startsWith('0'.repeat(_generateBlock.difficulty));
            if (result) {
                _generateBlock.hash = hash;
                return _generateBlock;
            }
        }
    }

    public static getDifficulty(_newBlock: Block, _adjustmentBlock: Block, _previousBlock: Block): number {
        // if (_adjustmentBlock.height === 0) return 0;
        if (_newBlock.height < 9) return 0;
        if (_newBlock.height < 19) return 1;
        // 시간을 구할때 10번째 배수의 블럭일때만 검사하길 원함
        if (_newBlock.height % DIFFICULTY_ADJUSTMENT_INTERVAL !== 0) return _previousBlock.difficulty;

        const timeTaken: number = _newBlock.timestamp - _adjustmentBlock.timestamp;
        const timeExpected: number = UNIT * BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;

        if (timeTaken < timeExpected / 2) return _adjustmentBlock.difficulty + 1;
        else if (timeTaken > timeExpected * 2) return _adjustmentBlock.difficulty - 1;

        return _adjustmentBlock.difficulty;
    }

    //블록 검증 -> 검증하기위해 현재블록 높이와 이전블록 높이가 필요 : 2개의 인자값이 필요
    public static isValidNewBlock(_newBlock: Block, _previousBlock: Block): Failable<Block, string> {
        // '이전블록높이 + 1 === 새로생긴 블록의 높이' 검사
        // '이전블록.해쉬 === 현재블록.해쉬' 검사
        // '_newBlock의 값들을 가져와서 해쉬를 새로 만들고 그 해쉬와 _newBlock의 기존해쉬가 같은지 검사'
        if (_previousBlock.height + 1 !== _newBlock.height) return { isError: true, error: '블록높이가 맞지않습니다' };

        if (_previousBlock.hash !== _newBlock.previousHash)
            return { isError: true, error: '이전 해쉬값이 맞지않습니다' };

        if (Block.createBlockHash(_newBlock) !== _newBlock.hash)
            return { isError: true, error: '블록해쉬가 올바르지않습니다' };

        return { isError: false, value: _newBlock };
    }
}

/* 
    merkleRoot - data가 필요
    hash - merkleRoot + version + timestamp + previousHash + height 가 필요
*/
