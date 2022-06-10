/* İsmail Semih Şentürk */
/* Metehan Temel */
import * as crypto from "crypto";
const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {type: 'spki', format: 'pem'},
    privateKeyEncoding: {type: 'pkcs8', format: 'pem'},
});
const sign = crypto.createSign('SHA256');
sign.update("Test");
console.log(sign.sign(keyPair.privateKey));