// core / index
import { BlockChain } from '@core/index';
import { P2PServer } from './src/serve/p2p';
import express from 'express';

const app = express();
const ws = new P2PServer();
const bc = new BlockChain();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('tctcchain');
});

//블럭내용
app.get('/chains', (req, res) => {
    res.json(bc.chain.getChain());
});

//블럭채굴
app.post('/mineBlock', (req, res) => {
    const { data } = req.body; //data값은 []로 던져줘야함
    const newBlock = bc.chain.addBlock(data);
    if (newBlock.isError) return res.status(500).json(newBlock.error);

    res.json(newBlock.value);
});

app.post('/addToPeer', (req, res) => {
    const { peer } = req.body;
    ws.connectTopeer(peer);
});

app.listen(3000, () => {
    console.log('서버시작');
    ws.listen();
});

//npx ts-node index.ts
