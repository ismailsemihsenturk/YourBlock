/* İsmail Semih Şentürk */
/* Metehan Temel */
import * as crypto from "crypto";
const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {type: 'spki', format: 'pem'},
    privateKeyEncoding: {type: 'pkcs8', format: 'pem'},
});
const sign = crypto.createSign('SHA256');
sign.update("Test");
//console.log(sign.sign(keyPair.privateKey));
class Block{
    index:number;
    timestamp:any;
    data:any;
    previousHash:any;
    hash:any;
    nonce:number;

    constructor(index:number, timestamp:string, data:any, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return crypto.createHmac('sha256', this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).digest('hex');
    }

    mineBlock(difficulty : number){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Mined: " + this.hash);
    }
}


class Blockchain{
    chain:Block[];
    difficulty:number;

    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
    }

    createGenesisBlock(){
        return new Block(0, "09.06.2022", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock:Block){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i = 1; i<this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let testCoin = new Blockchain();
console.log("Mining block 1");
testCoin.addBlock(new Block(1, "10.06.2022", { amount: 4}));
console.log("Mining block 2");
testCoin.addBlock(new Block(2, "11.06.2022", { amount: 3}));

console.log(JSON.stringify(testCoin, null, 4));

console.log(testCoin.isChainValid());

testCoin.chain[1].data = {amount : 10};

console.log(testCoin.isChainValid());