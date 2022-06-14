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
exports.Blockchain = exports.Block = exports.Transaction = void 0;
var crypto = __importStar(require("crypto"));
var elliptic = __importStar(require("elliptic"));
var ec = new elliptic.ec('secp256k1');
var Transaction = /** @class */ (function () {
    function Transaction(fromAddress, toAddress, amount) {
        this.signature = null;
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
    Transaction.prototype.calculateHash = function () {
        if (this.fromAddress === null)
            return "";
        return crypto.createHmac('sha256', this.fromAddress + this.toAddress + this.amount).digest('hex');
    };
    Transaction.prototype.signTransaction = function (signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error("You cannot sign");
        }
        var hashTx = this.calculateHash();
        var sign = signingKey.sign(hashTx, 'base64');
        this.signature = sign.toDER('hex');
    };
    Transaction.prototype.isValid = function () {
        if (this.fromAddress === null)
            return true;
        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature');
        }
        var publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    };
    return Transaction;
}());
exports.Transaction = Transaction;
var Block = /** @class */ (function () {
    function Block(timestamp, transactions, previousHash) {
        if (previousHash === void 0) { previousHash = ''; }
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    Block.prototype.calculateHash = function () {
        return crypto.createHmac('sha256', this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).digest('hex');
    };
    Block.prototype.mineBlock = function (difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Mined: " + this.hash);
    };
    Block.prototype.haveValidTransactions = function () {
        for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
            var transaction = _a[_i];
            if (transaction.isValid()) {
                return false;
            }
        }
        return true;
    };
    return Block;
}());
exports.Block = Block;
var Blockchain = /** @class */ (function () {
    function Blockchain() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
        this.miningReward = 100;
        this.pendingTransactions = [];
    }
    Blockchain.prototype.createGenesisBlock = function () {
        return new Block(Date.now(), new Array(), "");
    };
    Blockchain.prototype.getLatestBlock = function () {
        return this.chain[this.chain.length - 1];
    };
    Blockchain.prototype.minePendingTransactions = function (miningRewardAddress) {
        var block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        console.log("Block mined");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    };
    Blockchain.prototype.addTransaction = function (transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from,to address');
        }
        if (!transaction.isValid()) {
            throw new Error('Transaction invalid');
        }
        this.pendingTransactions.push(transaction);
    };
    Blockchain.prototype.getBalanceOfAddress = function (address) {
        var balance = 0;
        for (var _i = 0, _a = this.chain; _i < _a.length; _i++) {
            var block = _a[_i];
            for (var _b = 0, _c = block.transactions; _b < _c.length; _b++) {
                var trans = _c[_b];
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    };
    Blockchain.prototype.isChainValid = function () {
        for (var i = 1; i < this.chain.length; i++) {
            var currentBlock = this.chain[i];
            var previousBlock = this.chain[i - 1];
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
    };
    return Blockchain;
}());
exports.Blockchain = Blockchain;
