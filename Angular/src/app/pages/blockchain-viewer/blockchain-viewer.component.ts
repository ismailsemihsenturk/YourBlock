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

  constructor(private blockchainService: BlockchainService) {
    this.blocks = blockchainService.getBlocks();
   }

  ngOnInit(): void {
  }

}
