import { Component, OnInit } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { Transaction } from 'yourblock/lib/Blockchain';

@Component({
  selector: 'app-pending-transactions',
  templateUrl: './pending-transactions.component.html',
  styleUrls: ['./pending-transactions.component.scss']
})
export class PendingTransactionsComponent implements OnInit {

  public pendingTransactions:Transaction[] = [];
  public miningInProgress:Boolean = false;

  constructor(private blockchainService:BlockchainService) {
    this.pendingTransactions = blockchainService.getPendingTransactions();
   }

  ngOnInit(): void {
  }

  minePendingTransactions(){
    this.miningInProgress = true;
    this.blockchainService.minePendingTransactions();
    this.miningInProgress = false;
  }

}
