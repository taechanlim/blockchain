import { randomBytes } from 'crypto';
import elliptic from 'elliptic';
import { SHA256 } from 'crypto-js';
//elliptic -> 타원곡선함수 알고리즘 라이브러리

const ec = new elliptic.ec('secp256k1');

describe('지갑이해하기', () => {
    let privateKey: string, publicKey: string;
    let signature: elliptic.ec.Signature;

    it('비밀키(private key)', () => {
        privateKey = randomBytes(32).toString('hex');
        // console.log(privateKey.length);
    });

    it('공개키 생성', () => {
        const keyPair = ec.keyFromPrivate(privateKey);
        publicKey = keyPair.getPublic().encode('hex', true);
        // console.log(publicKey);
    });

    it('디지털 서명', () => {
        // 서명을 만들때 필요한 값 - 개인키,해쉬값(transaction hash)
        const keyPair = ec.keyFromPrivate(privateKey);
        const hash = SHA256('example').toString();

        signature = keyPair.sign(hash, 'hex');
        // console.log(keyPair.sign(hash, 'hex'));
    });

    it('검증 (verify)', () => {
        //서명 , hash , 공개 키
        const hash = SHA256('example').toString();
        const verify = ec.verify(hash, signature, ec.keyFromPublic(publicKey, 'hex'));
        console.log(verify);
    });

    it('계정만들기', () => {
        const buffer = Buffer.from(publicKey);
        const address = buffer.slice(26).toString();
        // console.log(address);
    });
});
