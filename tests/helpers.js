/*!
 * Copyright 2022 Digital Bazaar, Inc. All Rights Reserved
 */
import * as didKey from '@digitalbazaar/did-method-key';
import * as Ed25519Multikey from '@digitalbazaar/ed25519-multikey';
import {IdDecoder, IdEncoder} from 'bnid';
import {klona} from 'klona';
import {v4 as uuidv4} from 'uuid';
import varint from 'varint';

const multibaseMultikeyHeader = 'z6Mk';
const didKeyDriver = didKey.driver();
didKeyDriver.use({
  multibaseMultikeyHeader,
  fromMultibase: Ed25519Multikey.from
});
const decoder = new IdDecoder({
  encoding: 'base58',
  multibase: true
});

export const createInitialVc = async ({issuer, vc}) => {
  const {settings: {id: issuerId, options}} = issuer;
  const credential = klona(vc);
  credential.id = `urn:uuid:${uuidv4()}`;
  credential.issuer = issuerId;
  const body = {credential, options};
  const {data, error} = await issuer.post({json: body});
  if(error) {
    throw error;
  }
  return data;
};

// base58, multibase, fixed-length encoder
const encoder = new IdEncoder({
  encoding: 'base58',
  multibase: true
});

export const getPublicKeyBytes = async ({did}) => {
  const didDoc = await didKeyDriver.get({did});
  const multiCodecBytes = decoder.decode(didDoc.publicKeyMultibase);
  // extracts the varint bytes
  varint.decode(multiCodecBytes);
  // how many bytes were used to specify the size of the key material
  const varBytes = varint.decode.bytes;
  // return just the key material
  return multiCodecBytes.slice(varBytes, multiCodecBytes.length);
};

export const bs58Decode = ({id}) => decoder.decode(id);

export const bs58Encode = data => encoder.encode(data);
