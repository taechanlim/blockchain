import { verify } from 'crypto';
import { SHA256 } from 'crypto-js';
import elliptic from 'elliptic';

const ec = new elliptic.ec('secp256k1');

export type Signature = elliptic.ec.Signature;

export interface ReceivedTx {
    sender: string;
    receiver: string;
    amount: number;
    signature: Signature;
}

export class Wallet {
    public publicKey: string;
    public account: string;
    public balance: number;
    public signature: Signature;

    constructor(_sender: string, _signature: Signature) {
        this.publicKey = _sender;
        this.account = this.getAccount();
        this.balance = 0;
        this.signature = _signature;
    }

    static sendTransaction(_receivedTx: ReceivedTx) {
        //서명 검증
        const verify = Wallet.getVerify(_receivedTx);
        if (verify.isError) throw new Error(verify.error);

        // console.log('isError', verify.isError);

        //보내는 사람의 지갑정보 최신화
        const myWallet = new this(_receivedTx.sender, _receivedTx.signature);

        //balance Check!(잔액이 올바르게 있는지 확인)
        //transaction 만드는 과정
    }

    static getVerify(_receivedTx: ReceivedTx): Failable<undefined, string> {
        const { sender, receiver, amount, signature } = _receivedTx;
        const hash: string = SHA256([sender, receiver, amount].join('')).toString();

        //타원곡선 알고리즘 사용
        const keyPair = ec.keyFromPublic(sender, 'hex');
        const isVerify = keyPair.verify(hash, signature);
        // console.log(isVerify);
        if (!isVerify) return { isError: true, error: '서명이 올바르지 않습니다.' };

        return { isError: false, value: undefined };
    }

    getAccount(): string {
        return Buffer.from(this.publicKey).slice(26).toString();
    }
}
