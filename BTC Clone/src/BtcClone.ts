/* İsmail Semih Şentürk */
/* Metehan Temel */
import * as crypto from "crypto";
import * as elliptic from "elliptic";
import { Blockchain, Transaction, Block } from "./Blockchain";

const ec = new elliptic.ec('secp256k1');



const user_1 : elliptic.ec.KeyPair = ec.genKeyPair();
const user_2 : elliptic.ec.KeyPair = ec.genKeyPair();
const miner_1 : elliptic.ec.KeyPair = ec.genKeyPair();

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