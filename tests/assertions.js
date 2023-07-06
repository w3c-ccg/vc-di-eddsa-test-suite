/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import chai from 'chai';

const should = chai.should();

/**
 * Tests the properties of a credential.
 *
 * @param {object} credential - A Vc issued from an issuer.
 *
 * @returns {undefined} Just returns on success.
 */
export const testCredential = credential => {
  should.exist(credential, 'expected credential to exist');
  credential.should.be.an('object');
  credential.should.have.property('@context');
  // NOTE: some issuers add a revocation list context to the types
  credential['@context'].should.include(
    'https://www.w3.org/2018/credentials/v1');
  credential.should.have.property('type');
  credential.type.should.eql([
    'VerifiableCredential',
  ]);
  credential.should.have.property('id');
  credential.id.should.be.a('string');
  credential.should.have.property('credentialSubject');
  credential.credentialSubject.should.be.an('object');
  credential.should.have.property('issuanceDate');
  credential.issuanceDate.should.be.a('string');
  credential.should.have.property('expirationDate');
  credential.expirationDate.should.be.a('string');
  credential.should.have.property('issuer');
  credential.issuer.should.be.a('string');
  credential.should.have.property('proof');
  credential.proof.should.be.an('object');
};

export const verificationFail = async ({credential, verifier}) => {
  const body = {
    verifiableCredential: credential,
    options: {
      checks: ['proof']
    }
  };
  const {result, error} = await verifier.post({json: body});
  should.not.exist(result, 'Expected no result from verifier.');
  should.exist(error, 'Expected verifier to error.');
  should.exist(error.status, 'Expected verifier to return an HTTP Status code');
  error.status.should.equal(
    400,
    'Expected HTTP Status code 400 invalid input!'
  );
};

export const verificationSuccess = async ({credential, verifier}) => {
  const body = {
    verifiableCredential: credential,
    options: {
      checks: ['proof']
    }
  };
  const {result, error} = await verifier.post({json: body});
  should.exist(result, 'Expected a result from verifier.');
  should.not.exist(error, 'Expected verifier to not error.');
  should.exist(result.status,
    'Expected verifier to return an HTTP Status code');
  result.status.should.equal(
    200,
    'Expected HTTP Status code 200.'
  );
};
