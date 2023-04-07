import { App, Logger } from '@core/globals';
import { resolve } from 'path';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { generateKeyPairSync } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

class JWTHelper {
  private PVT_KEY_SECRET = App.Config.PVT_KEY_SECRET;
  private JWT_EXPIRY_SECS = App.Config.JWT_EXPIRY_SECS;
  private keyDir = resolve(`${process.cwd()}/keys`);
  private publicKeyPath = resolve(`${this.keyDir}/rsa.pub`);
  private privateKeyPath = resolve(`${this.keyDir}/rsa`);
  private publicKey: Buffer;
  private privateKey: Buffer;

  constructor() {
    this.GenerateKeys();
    this.publicKey = readFileSync(this.publicKeyPath);
    this.privateKey = readFileSync(this.privateKeyPath);
  }

  /**
   * Get token user
   * @param { token } payload
   * @returns
   */
  async GetUser(payload: { token: string }) {
    const { token } = payload;
    const verification = this.VerifyToken(token);
    if (verification) {
      const user = await App.DB.User.findByPk(verification.sub as string);
      return user;
    }
    return null;
  }

  /**
   * Verify the token with rsa public key.
   * @param {string} token
   * @returns string | JwtPayload
   */
  VerifyToken(token: string): string | JwtPayload {
    try {
      return jwt.verify(token, this.publicKey, {
        algorithms: ['RS256'],
        complete: false,
      });
    } catch (error) {
      Logger.error(error);
    }
    return null;
  }

  /**
   * Create a signed JWT with the rsa private key.
   * @param {*} payload
   * @returns token
   */
  GenerateToken(payload: { _id: string }): string {
    const { _id: _user } = payload;

    return jwt.sign(
      null,
      { key: this.privateKey, passphrase: this.PVT_KEY_SECRET },
      {
        algorithm: 'RS256',
        expiresIn: this.JWT_EXPIRY_SECS,
        subject: _user,
      }
    );
  }

  /**
   * Generates RSA Key Pairs for JWT authentication
   * It will generate the keys only if the keys are not present.
   */
  GenerateKeys(): void {
    try {
      const keyDir = this.keyDir;
      const publicKeyPath = this.publicKeyPath;
      const privateKeyPath = this.privateKeyPath;

      const JWT_SECRET = this.PVT_KEY_SECRET;

      // Throw error if JWT_SECRET is not set
      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined.');
      }

      // Check if config/keys exists or not
      if (!existsSync(keyDir)) {
        mkdirSync(keyDir);
      }

      // Check if PUBLIC and PRIVATE KEY exists else generate new
      if (!existsSync(publicKeyPath) && !existsSync(privateKeyPath)) {
        const result = generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: JWT_SECRET,
          },
        });

        const { publicKey, privateKey } = result;
        writeFileSync(`${keyDir}/rsa.pub`, publicKey, { flag: 'wx' });
        writeFileSync(`${keyDir}/rsa`, privateKey, { flag: 'wx' });
        Logger.warn('New public and private key generated.');
      }
    } catch (error) {
      Logger.error(error);
    }
  }
}

// All Done
export default new JWTHelper();
