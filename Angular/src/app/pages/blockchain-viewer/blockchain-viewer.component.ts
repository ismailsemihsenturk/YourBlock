import { Component, OnInit } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { Block } from 'yourblock/lib/Blockchain';

@Component({
  selector: 'app-blockchain-viewer',
  templateUrl: './blockchain-viewer.component.html',
  styleUrls: ['./blockchain-viewer.component.scss']
})
export class BlockchainViewerComponent implements OnInit {
  public blocks:Array<Block> = [];
  public selectedBlock:Block;

  constructor(private blockchainService: BlockchainService) {
    this.blocks = blockchainService.getBlocks();
    this.selectedBlock = this.blocks[0];
   }

  ngOnInit(): void {
  }

  showTransactions(block:Block){
    this.selectedBlock = block;
  }

}
