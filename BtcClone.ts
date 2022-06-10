//ts dosyasını "js" olarak ver yoksa çalışmaz. tsc --init yapıp tsconfig aç
import * as crypto from "crypto";
import { json } from "stream/consumers";

class Transaction {

  constructor(
    public amount: number,
    public payer: string,
    public payee: string
  ) { }

  toString() {
    return JSON.stringify(this);
  }

}


class Block {

  public nonce = Math.round(Math.random() * 999999999);

  constructor(
    public prevHash: string | null,
    public transaction: Transaction,
    public ts = Date.now()

  ) { }

  get hash() {
    const str = JSON.stringify(this);
    const hash = crypto.createHash('SHA256');
    hash.update(str).end();
    return hash.digest('hex');

  }

}


class Chain {
  public static instance = new Chain(); //singleton çünkü tek bir chain var.
  chain: Block[];

  constructor() {
    // Genesis Block
    this.chain = [new Block(null, new Transaction(100, 'genesis', 'iso'))];
  }

  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  // Proof of work sistemi
  // nonce ve solution ile tekrardan MD5 fonksiyonuna girdikten sonra hash'in son dört hanesi "0" ise işlem tamamlanmıştır. Başka şartlarda seçilebilir.
  mine(nonce: number) {
    let solution = 1;
    console.log('⛏️  mining...')

    while(true) {

      const hash = crypto.createHash('MD5');
      hash.update((nonce + solution).toString()).end();

      const attempt = hash.digest('hex');

      if(attempt.substr(0,4) === '0000'){
        console.log(`Solved: ${solution}`);
        return solution;
      }

      solution += 1;
    }
  }

  addBlock(transaction: Transaction, senderPublicKey: string, signature: Buffer) {
    const verify = crypto.createVerify('SHA256');
    verify.update(transaction.toString());

    const isValid = verify.verify(senderPublicKey, signature);

    if (isValid) {
      const newBlock = new Block(this.lastBlock.hash, transaction);
      this.mine(newBlock.nonce);
      this.chain.push(newBlock);
    }
  }

}


class Wallet {
  // tsconfig "strictPropertyInitialization": false ya da "!" veya static kullan.
  public publicKey!: string;
  public privateKey!: string;

  constructor() {
    const keypair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    // pc'de sonra kullanılmak üzere key'leri saklamak için.

    this.privateKey = keypair.privateKey;
    this.publicKey = keypair.publicKey;
  }

  sendMoney(amount: number, payeePublicKey: string){
    const transaction = new Transaction(amount,this.publicKey,payeePublicKey);

    const sign = crypto.createSign('SHA256');
    sign.update(transaction.toString()).end();

    const signature = sign.sign(this.privateKey); // kendi priv key'imiz ile imzalıyoruz.
    Chain.instance.addBlock(transaction,this.publicKey,signature);
  }


}

// Örnek kullanım
// npm start

const iso = new Wallet();
const mete = new Wallet();
const senol = new Wallet();

iso.sendMoney(50, mete.publicKey);
mete.sendMoney(23, senol.publicKey);
senol.sendMoney(5, mete.publicKey);

console.log(Chain.instance)