import * as elliptic from "elliptic";
export declare class Transaction {
    fromAddress: string | null;
    toAddress: string;
    amount: number;
    signature: string | null;
    constructor(fromAddress: string | null, toAddress: string, amount: number);
    calculateHash(): string;
    signTransaction(signingKey: elliptic.ec.KeyPair): void;
    isValid(): boolean;
}
export declare class Block {
    timestamp: number;
    transactions: any;
    previousHash: any;
    hash: any;
    nonce: number;
    constructor(timestamp: number, transactions: any, previousHash?: string);
    calculateHash(): string;
    mineBlock(difficulty: number): void;
    haveValidTransactions(): boolean;
}
export declare class Blockchain {
    chain: Block[];
    difficulty: number;
    miningReward: number;
    pendingTransactions: Transaction[];
    constructor();
    createGenesisBlock(): Block;
    getLatestBlock(): Block;
    minePendingTransactions(miningRewardAddress: string): void;
    addTransaction(transaction: Transaction): void;
    getBalanceOfAddress(address: string): number;
    isChainValid(): boolean;
}
