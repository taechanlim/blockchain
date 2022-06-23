// 난이도 조정블럭 범위
export const DIFFICULTY_ADJUSTMENT_INTERVAL: number = 10;

//블럭생성시간 (단위:분)
export const BLOCK_GENERATION_INTERVAL: number = 10;

//블럭 한개당 생성되는 시간
export const UNIT: number = 60;

export const GENESIS: IBlock = {
    version: '1.0.0',
    height: 0,
    hash: '0'.repeat(64),
    timestamp: 1231006506,
    previousHash: '0'.repeat(64),
    merkleRoot: '0'.repeat(64),
    difficulty: 0,
    nonce: 0,
    data: [],
};
