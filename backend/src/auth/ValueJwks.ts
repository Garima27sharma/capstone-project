 import axios from 'axios';
 import { KeyValues } from './KeyValues';
 import { Matchjwk } from './Matchjwk';
 import { cerTfun } from './utils';
 
 let jwksVerify: Matchjwk[] = [];
 
 export class ValueJwks {
     public constructor(private readonly jwksUrl: string) { }
 
     async createJwks(): Promise<Matchjwk[]> {
         if (jwksVerify.length > 0) return jwksVerify;
 
         const res = await axios.get(this.jwksUrl);
         const token = res.data.keys;
         jwksVerify = token;
         return token;
     }

     async createSigningKey(kid: string): Promise<KeyValues> {
        const values = await this.getSigningKeys();
        const signingValue = values.find((key): boolean => key.kid === kid);
        if (!signingValue) {
            throw new Error(
                `not find signing value '${kid}'`,
            );
        }
        return signingValue;
    }
 
     async getSigningKeys(): Promise<KeyValues[]> {
         const jwksToken = await this.createJwks();
 
         if (!jwksToken || jwksToken.length === 0) {
             throw new Error('JWKS have not exist keys');
         }
 
         const keyToken = jwksToken
             .filter(
                 (key): boolean =>
                     key.use === 'sig' &&     
                     key.kid && key.x5c &&
                     key.kty === 'RSA' && 
                     key.x5c.length > 0 
             )
             .map(
                 (key): KeyValues => ({
                     kid: key.kid,
                     publicKey: cerTfun(key.x5c[0]),
                     nbf: key.nbf,
                 }),
             );
 
         if (!keyToken.length) {
             throw new Error(
                 'JWKS not exist signing token',
             );
         }
         return keyToken;
    }
 
}
 