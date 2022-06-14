import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from 'yourblock/lib/Blockchain';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss']
})
export class TransactionsTableComponent implements OnInit {

  @Input() public transactions:Array<Transaction> = [];

  constructor() { }

  ngOnInit(): void {
  }

}
