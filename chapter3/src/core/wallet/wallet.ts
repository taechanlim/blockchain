import { Transaction } from '@core/transaction/transaction';
import { UnspentTxOut } from '@core/transaction/unspentTxOut';
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

    constructor(_sender: string, _signature: Signature, UnspentTxOuts: UnspentTxOut[]) {
        this.publicKey = _sender;
        this.account = this.getAccount(this.publicKey);
        this.balance = Wallet.getBalance(this.account, UnspentTxOuts);
        this.signature = _signature;
    }

    static sendTransaction(_receivedTx: any, UnspentTxOuts: UnspentTxOuts[]): Transaction {
        //서명 검증
        const verify = Wallet.getVerify(_receivedTx);
        if (verify.isError) throw new Error(verify.error);

        // console.log('isError', verify.isError);

        //보내는 사람의 지갑정보 최신화
        const myWallet = new this(_receivedTx.sender, _receivedTx.signature, UnspentTxOuts);

        //balance Check!(잔액이 올바르게 있는지 확인)
        if (myWallet.balance < _receivedTx.amount) throw new Error('잔액이 모자랍니다');

        //transaction 만드는 과정
        const myUTXO: UnspentTxOut[] = UnspentTxOut.getMyUnspentTxOuts(myWallet.account, UnspentTxOuts);
        const tx: Transaction = Transaction.createTransaction(_receivedTx, myUTXO);
        return tx;
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

    static getAccount(publicKey: string): string {
        return Buffer.from(publicKey).slice(26).toString();
    }

    static getBalance(_account: string, _UnspentTxOuts: IUnspentTxOut[]): number {
        return _UnspentTxOuts.filter((v) => {
            return v.account === _account;
        });
    }
}
