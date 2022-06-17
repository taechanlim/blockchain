// 비트코인 형태

interface ITxIn {
    txOutId: string;
    txOutIndex: number;
    siganture?: any;
}
interface ITxOut {
    address: string;
    amount: number;
}

interface ITransaction {
    hash: string;
    txins: ITxIn[];
    txouts: ITxOut[];
}
