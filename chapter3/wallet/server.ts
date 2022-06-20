import express from 'express';
import nunjucks from 'nunjucks';
import { Wallet } from './wallet';
import axios from 'axios';

const app = express();

//axios
//authorization
const userid = process.env.USERID || 'web7722';
const userpw = process.env.USERPW || '1234';
const baseURL = process.env.BASEURL || 'http://localhost:3000';

const baseAuth = Buffer.from(userid + ':' + userpw).toString('base64');

const request = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        Authorization: 'Basic ' + baseAuth,
        'Content-type': 'application/json',
    },
});

app.use(express.json());
app.set('view engine', 'html');

nunjucks.configure('views', {
    express: app,
    watch: true,
});

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/newWallet', (req, res) => {
    res.json(new Wallet());
});

//list
app.post('/walletList', (req, res) => {
    // console.log('wallet list');
    const list = Wallet.getWalletList();
    res.json(list);
});

//view
app.get('/wallet/:account', (req, res) => {
    const { account } = req.params;
    const privateKey = Wallet.getWalletPrivateKey(account);
    res.json(new Wallet(privateKey));
});

//sendTransaction
app.post('/sendTransaction', async (req, res) => {
    const { publicKey, account } = req.body.sender;
    const { receiver, amount } = req.body;

    //받아야할 데이터 -> 보낼사람 : 공개키 , 받는사람 : 계정 , 보낼 양 , 서명
    //서명 : SHA256(보낼사람:공개키+받는사람:계정+보낼양).toString()
    const signature = Wallet.createSign(req.body);

    const txObject = {
        sender: publicKey,
        receiver,
        amount,
        signature,
    };

    const response = await request.post('/sendTransaction', txObject);

    res.json({});
});

app.listen(3005, () => {
    console.log('서버시작 3005');
});
