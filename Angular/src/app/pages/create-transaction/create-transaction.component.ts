import { Component, OnInit } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { Transaction } from 'yourblock/lib/Blockchain';

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss']
})
export class CreateTransactionComponent implements OnInit {

  public newTx:Transaction;
  public walletKey;

  constructor(private blockChainService: BlockchainService) {
    this.walletKey = blockChainService.walletKeys[0];
    this.newTx = new Transaction("","",0); 
   }

  ngOnInit(): void {
  }

  createTransaction(){
    this.newTx.fromAddress = this.walletKey.publicKey;
    this.newTx.signTransaction(this.walletKey.keyObj);
    
    this.blockChainService.addTransaction(this.newTx);
  }

}
