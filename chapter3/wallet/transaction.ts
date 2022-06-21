// 비트코인 형태

interface ITxIn {
    txOutId: string;
    signature: string;
    txOutIndex: number;

    //보내는 사람
    //보낸 금액
    //보내는 사람의 서명
}
interface ITxOut {
    address: string; //받는사람 주소
    amount: number; // 받을 양
}

interface ITransaction {
    hash: string;
    txins: ITxIn[];
    txouts: ITxOut[];
}

interface UnspentTxOuts {
    txOutId: string;
    txOutIndex: number;
    address: string;
    amount: number;
}
