//ts dosyasını "js" olarak ver yoksa çalışmaz. tsc --init yapıp tsconfig aç
import * as crypto from  "crypto";

const keypair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
console.log("sa "+ keypair.publicKey)