import { SHA256 } from 'crypto-js';
import { Transaction } from './transaction';
import { TxIn } from './txin';
import { TxOut } from './txout';

describe('transaction 생성', () => {
    //코인베이스
    let txin: TxIn;
    let txout: TxOut;
    let transaction;
    it('txin 생성해보기', () => {
        txin = new TxIn('', 0);
    });

    it('txout 생성해보기', () => {
        txout = new TxOut('4cc559fc8ff59a4138b589d620ab9ae898decfa8', 50);
    });

    it('transaction 생성해보기', () => {
        transaction = new Transaction([txin], [txout]);
        const utxo = transaction.createUTXO();
        console.log(utxo);
    });
});
