// core / index
import { BlockChain } from '@core/index';
import { P2PServer } from './src/serve/p2p';
import peers from './peer.json';
import express from 'express';
import { ReceivedTx } from '@core/wallet/wallet';
import { Wallet } from '@core/wallet/wallet';

const app = express();
const ws = new P2PServer();
const bc = new BlockChain();

app.use(express.json());

//요청 url이 'http://web7722:1234@localhost:3000'일때
app.use((req, res, next) => {
    const baseAuth: string = (req.headers.authorization || '').split(' ')[1];
    if (baseAuth === '') return res.status(401).send();

    const [userid, userpw] = Buffer.from(baseAuth, 'base64').toString().split(':');
    if (userid !== 'web7722' || userpw !== '1234') return res.status(401).send();
    // console.log(userid, userpw);

    next();
});

app.get('/', (req, res) => {
    res.send('tctcchain');
});

//블럭내용
app.get('/chains', (req, res) => {
    res.json(ws.getChain());
});

//블럭채굴
app.post('/mineBlock', (req, res) => {
    const { data } = req.body; //data값은 []로 던져줘야함
    const newBlock = ws.addBlock(data);
    if (newBlock.isError) return res.status(500).json(newBlock.error);

    res.json(newBlock.value);
});

app.post('/addToPeer', (req, res) => {
    const { peer } = req.body;
    ws.connectTopeer(peer);
});

app.post('/addPeers', (req, res) => {
    peers.forEach((peer) => {
        ws.connectTopeer(peer);
    });
});

app.get('/peers', (req, res) => {
    const sockets = ws.getSockets().map((s: any) => s._socket.remoteAddress + ':' + s._socket.remotePort);
    res.json(sockets);
});

app.post('/sendTransaction', (req, res) => {
    try {
        const receivedTx: ReceivedTx = req.body;
        Wallet.sendTransaction(receivedTx);
    } catch (e) {
        if (e instanceof Error) console.error(e.message);
    }

    res.json([]);
});

app.listen(3000, () => {
    console.log('서버시작');
    ws.listen();
});

//npx ts-node index.ts
