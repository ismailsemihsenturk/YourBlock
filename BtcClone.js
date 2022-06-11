"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* İsmail Semih Şentürk */
/* Metehan Temel */
const crypto = __importStar(require("crypto"));
const elliptic = __importStar(require("elliptic"));
const ec = new elliptic.ec('secp256k1');
class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.signature = null;
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
    calculateHash() {
        if (this.fromAddress === null)
            return "";
        return crypto.createHmac('sha256', this.fromAddress + this.toAddress + this.amount).digest('hex');
    }
    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error("You cannot sign");
        }
        const hashTx = this.calculateHash();
        const sign = signingKey.sign(hashTx, 'base64');
        this.signature = sign.toDER('hex');
    }
    isValid() {
        if (this.fromAddress === null)
            return true;
        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature');
        }
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}
class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash() {
        return crypto.createHmac('sha256', this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).digest('hex');
    }
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Mined: " + this.hash);
    }
    haveValidTransactions() {
        for (const transaction of this.transactions) {
            if (transaction.isValid()) {
                return false;
            }
        }
        return true;
    }
}
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
        this.miningReward = 100;
        this.pendingTransactions = [];
    }
    createGenesisBlock() {
        return new Block(Date.now(), new Array(), "");
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        console.log("Block mined");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }
    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from,to address');
        }
        if (!transaction.isValid()) {
            throw new Error('Transaction invalid');
        }
        this.pendingTransactions.push(transaction);
    }
    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (!currentBlock.haveValidTransactions()) {
                return false;
            }
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}
const user_1 = ec.genKeyPair();
const user_2 = ec.genKeyPair();
const miner_1 = ec.genKeyPair();
let testCoin = new Blockchain();
//create transactions
const transaction1 = new Transaction(user_1.getPublic('hex'), user_2.getPublic('hex'), 50);
transaction1.signTransaction(user_1);
testCoin.addTransaction(transaction1);
console.log("Start miner");
testCoin.minePendingTransactions(miner_1.getPublic('hex'));
console.log("miner-address balance = ", testCoin.getBalanceOfAddress(miner_1.getPublic('hex')));
testCoin.minePendingTransactions(miner_1.getPublic('hex'));
console.log("miner-address balance = ", testCoin.getBalanceOfAddress(miner_1.getPublic('hex')));
console.log("user_1 balance = ", testCoin.getBalanceOfAddress(user_1.getPublic('hex')));
