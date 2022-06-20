import { randomBytes } from 'crypto';
import { SHA256 } from 'crypto-js';
import elliptic from 'elliptic';
import fs from 'fs';
import path from 'path';

const dir = path.join(__dirname, '../data');

const ec = new elliptic.ec('secp256k1');

export class Wallet {
    public privateKey: string;
    public publicKey: string;
    public account: string;
    public balance: number;

    constructor(_privateKey: string = '') {
        this.privateKey = _privateKey || this.getPrivateKey();
        // this.privateKey = this.getPrivateKey();
        this.publicKey = this.getPublicKey();
        this.account = this.getAccount();
        this.balance = 0;

        Wallet.createWallet(this);
    }

    static createWallet(myWallet: Wallet) {
        //파일명을 account
        const filename = path.join(dir, myWallet.account);
        //내용을 privateKey
        const filecontent = myWallet.privateKey;

        fs.writeFileSync(filename, filecontent);
    }

    static getWalletList(): string[] {
        const files: string[] = fs.readdirSync(dir);
        return files;
    }

    static getWalletPrivateKey(_account: string) {
        const filepath = path.join(dir, _account);
        const filecontent = fs.readFileSync(filepath);
        return filecontent.toString();
    }

    static createSign(_obj: any): elliptic.ec.Signature {
        const {
            sender: { account, publicKey },
            receiver,
            amount,
        } = _obj;
        const hash: string = SHA256([publicKey, receiver, amount].join('')).toString();

        const privateKey: string = Wallet.getWalletPrivateKey(account);

        const keyPair: elliptic.ec.KeyPair = ec.keyFromPrivate(privateKey);
        return keyPair.sign(hash, 'hex');
    }

    public getPrivateKey(): string {
        return randomBytes(32).toString('hex');
    }

    public getPublicKey(): string {
        const keyPair = ec.keyFromPrivate(this.privateKey);
        return keyPair.getPublic().encode('hex', true);
    }

    public getAccount(): string {
        return Buffer.from(this.publicKey).slice(26).toString();
    }
}
