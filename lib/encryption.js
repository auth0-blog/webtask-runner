import crypto from 'crypto';

class Encryption {
  constructor() {
    this.key = new Buffer(process.env.ENCRYPTED_CONTEXT_PASSWORD, 'base64');
    this.algorithm = 'aes-256-cbc';
  }

  decrypt(ectx) {
    let localEctx = ectx.split('.');
    localEctx[0] = new Buffer(localEctx[0], 'base64'); // ciphertext
    localEctx[1] = new Buffer(localEctx[1], 'base64'); // iv
    var cipher = crypto.createDecipheriv(
        this.algorithm,
        this.key,
        localEctx[1]);
    var plaintext = cipher.update(localEctx[0], 'base64', 'utf8') + cipher.final('utf8');
    let decryptedEctx = JSON.parse(plaintext);
    if (!decryptedEctx || typeof decryptedEctx !== 'object')
        throw new Error('Ectx is not an object');
    return decryptedEctx;
  }

  encrypt(ectx) {
    let plaintext = JSON.stringify(ectx);
    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(
        this.algorithm,
        this.key,
        iv);
    let encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    return encrypted.toString('base64') + '.' + iv.toString('base64');
  }
}

export default new Encryption();
