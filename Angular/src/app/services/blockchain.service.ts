import { Injectable } from '@angular/core';
import { Blockchain, T1, Transaction } from 'yourblock/lib/Blockchain';
import * as EC from 'elliptic';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  public blockchainInstance:Blockchain;
  public walletKeys:Array<any> = [];

  constructor() {
    let transaction = new T1();
    this.blockchainInstance = new Blockchain();
    this.blockchainInstance.difficulty = 1;
    this.blockchainInstance.minePendingTransactions('my-wallet-address');

    this.generateWalletKeys();
   }

   getBlocks(){
    return this.blockchainInstance.chain;
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
