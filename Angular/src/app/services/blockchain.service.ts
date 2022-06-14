import { Injectable } from '@angular/core';
import { Blockchain, Transaction } from 'yourblock/lib/Blockchain';
import * as EC from 'elliptic';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  public blockchainInstance:Blockchain;
  public walletKeys:Array<any> = [];

  constructor() {
    this.blockchainInstance = new Blockchain();
    this.blockchainInstance.difficulty = 1;
    this.blockchainInstance.minePendingTransactions('my-wallet-address');

    this.generateWalletKeys();
   }

   getBlocks(){
    return this.blockchainInstance.chain;
   }

   addTransaction(transaction:Transaction){
    this.blockchainInstance.addTransaction(transaction);
   }

   getPendingTransactions(){
    return this.blockchainInstance.pendingTransactions;
   }

   minePendingTransactions(){
    this.blockchainInstance.minePendingTransactions(
      this.walletKeys[0].publicKey
    );
   }


   private generateWalletKeys(){
    const ec = new EC.ec('secp256k1');
    const key = ec.genKeyPair();

    this.walletKeys.push({
      keyObj: key,
      publicKey: key.getPublic('hex'),
      privateKey: key.getPrivate('hex'),
    });
   }
}
