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
var elliptic = __importStar(require("elliptic"));
var Blockchain_1 = require("./Blockchain");
var ec = new elliptic.ec('secp256k1');
var user_1 = ec.genKeyPair();
var user_2 = ec.genKeyPair();
var miner_1 = ec.genKeyPair();
var testCoin = new Blockchain_1.Blockchain();
//create transactions
var transaction1 = new Blockchain_1.Transaction(user_1.getPublic('hex'), user_2.getPublic('hex'), 50);
transaction1.signTransaction(user_1);
testCoin.addTransaction(transaction1);
console.log("Start miner");
testCoin.minePendingTransactions(miner_1.getPublic('hex'));
console.log("miner-address balance = ", testCoin.getBalanceOfAddress(miner_1.getPublic('hex')));
testCoin.minePendingTransactions(miner_1.getPublic('hex'));
console.log("miner-address balance = ", testCoin.getBalanceOfAddress(miner_1.getPublic('hex')));
console.log("user_1 balance = ", testCoin.getBalanceOfAddress(user_1.getPublic('hex')));
