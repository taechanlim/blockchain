const merkle = require('merkle')
const SHA256 = require('crypto-js/sha256')

// block이 여러개 생성되야하므로 함수 혹은 class를 사용



// class Block {
//     constructor(_version,_height,_timestamp,_previousHash,_hash,_merkleRoot,_data){
//         this.version = _version;
//         this.height = _height;
//         this.timestamp = _timestamp;
//         this.previousHash = _previousHash
//         this.hash = _hash
//         this.merkleRoot = _merkleRoot
//         this.data = _data
//     }
// }

// const block = new Block('a');
// console.log(block) //Block { version: 'a' } 출력

// () 매개변수는 3개이상 안하는게 best이므로 안받아도되는 데이터는 지운다.(timestamp,hash등)

class BlockHeader {
    constructor(_height,_previousHash = ''){
        this.version = BlockHeader.getVersion(); // 고정값이므로 매개변수 안받아도됨
        this.height = _height // 일단은 받아야함
        this.timestamp = BlockHeader.getTimestamp(); // 안받아도됨
        this.previousHash = _previousHash=='' ? "0".repeat(64) : _previousHash //제네시스블록이면 이전해쉬값이 없으므로 0을 64개 적겠다.
        // this.hash // 안받아도됨(사실 여기서 못받는 값임)
        // this.merkleRoot // 헤더의 내용이지만 헤더를 만들때 받을수없는 값임.(body내용의 hash값이기때문)
    }
    static getVersion(){
        return "1.0.0";
    }

    static getTimestamp(){
        return new Date().getTime()
    }
}
//new 라는 키워드를 사용해서 class문법을 사용했을때 나오는 결과물의 객체를 인스턴스라고 함


// header.getVersion() //static 안붙음
// BlockHeader.getVersion() //static 붙음
//static : 인스턴스 생성전에 사용할지 생성후에 사용할지정할때 사용. static을 사용하면 인스턴스 생성전에 사용할수 있게함


class Block {
    constructor(_header,_data){
        const merkleroot = Block.getMerkleRoot(_data)
        this.version = _header.version;
        this.height = _header.height;
        this.timestamp = _header.timestamp;
        this.previousHash = _header.previousHash
        this.merkleRoot = merkleroot
        this.hash = Block.createBlockHash(_header, merkleroot);
        this.data = _data
    }

    static getMerkleRoot(_data){
        const merkleTree = merkle('sha256').sync(data)
        const merkleRoot = merkleTree.root()
        return merkleRoot
    }

    static createBlockHash(_header,_merkleroot){
        //TODO : 1. header 객체안에있는 값을 스트링으로 연결
        const values = Object.values(_header)
        const data = values.join('') + _merkleroot

        return SHA256(data).toString()
    }
}

//previousHash
//block 연결하는 애가 chain
//block 에서 첫번째 블록은 제네시스 블록이라는 명칭이 붙는다.

const header = new BlockHeader(0) //new BlockHeader(0,'dwqdqwd') 이 두번째 매개변수는 previousHash값을 넣어주면된다.
console.log('블록헤더',header)

const data = ['eqweqwe','eqweqweq','ewqeqweqw','eqweqwe','eqweqweq','ewqeqweqw'] //임시로 임의의 값
const block = new Block(header,data)
console.log('나 블록',block)


