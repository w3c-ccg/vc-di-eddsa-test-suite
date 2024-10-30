/*!
 * Copyright (c) 2022-2024 Digital Bazaar, Inc.
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {
  bs58Decode,
  createInitialVc,
  getProofs,
  getVerificationMethodDocuments,
  setupMatrix,
  setupRow,
  shouldBeBs58
} from '../helpers.js';
import chai from 'chai';
import {generateTestData} from '../vc-generator/index.js';

const should = chai.should();

export function verificationMethods({suiteName, match}) {
  return describe(
    `${suiteName} - Data Model - Verification Methods (Multikey)`, function() {
      setupMatrix.call(this, match);
      let validVc;
      before(async function() {
        const credentials = await generateTestData();
        validVc = credentials.clone('validVc');
      });
      for(const [columnId, {endpoints}] of match) {
        describe(columnId, function() {
          const [issuer] = endpoints;
          let issuedVc;
          let proofs;
          let verificationMethodDocuments = [];
          before(async function() {
            issuedVc = await createInitialVc({issuer, vc: validVc});
            proofs = getProofs(issuedVc);
            verificationMethodDocuments =
              await getVerificationMethodDocuments(proofs);
          });
          beforeEach(setupRow);
          it('The publicKeyMultibase value of the verification method MUST ' +
            'start with the base-58-btc prefix (z), as defined in the ' +
            'Multibase section of Controller Documents 1.0.',
          async function() {
            this.test.link = 'https://w3c.github.io/vc-di-eddsa/#:~:text=The%20publicKeyMultibase%20value%20of%20the%20verification%20method%20MUST%20start%20with%20the%20base%2D58%2Dbtc%20prefix%20(z)%2C%20as%20defined%20in%20the%20Multibase%20section%20of%20Controller%20Documents%201.0.';
            verificationMethodDocuments.should.not.eql([],
              'Expected at least one "verificationMethodDocument".');
            for(const verificationMethodDocument of
              verificationMethodDocuments) {
              const multibase = 'z';
              const {publicKeyMultibase} = verificationMethodDocument;
              const isMultibaseEncoded =
                  publicKeyMultibase.startsWith(multibase) &&
                  shouldBeBs58(publicKeyMultibase);
              isMultibaseEncoded.should.equal(
                true,
                'Expected "publicKeyMultibase" value of the verification ' +
                  'method to be multibase base58-btc encoded value'
              );
            }
          });
          it('Any other encoding MUST NOT be allowed.',
            async function() {
              this.test.link = 'https://w3c.github.io/vc-di-eddsa/#:~:text=of%20Controller%20Documents%201.0.-,Any%20other%20encoding%20MUST%20NOT%20be%20allowed.,-Developers%20are%20advised%20to%20not';
              verificationMethodDocuments.should.not.eql([],
                'Expected at least one "verificationMethodDocument".');
              for(const verificationMethodDocument of
                verificationMethodDocuments) {
                const multibase = 'z';
                const {publicKeyMultibase} = verificationMethodDocument;
                const isMultibaseEncoded =
                  publicKeyMultibase.startsWith(multibase) &&
                  shouldBeBs58(publicKeyMultibase);
                isMultibaseEncoded.should.equal(
                  true,
                  'Expected "publicKeyMultibase" value of the verification ' +
                  'method to be multibase base58-btc encoded value'
                );
              }
            });
          it('The secretKeyMultibase value of the verification method ' +
            'MUST start with the base-58-btc prefix (z), as defined in the ' +
            'Multibase section of Controller Documents 1.0.',
          async function() {
            this.test.link = 'https://w3c.github.io/vc-di-eddsa/#:~:text=The%20secretKeyMultibase%20value%20of%20the%20verification%20method%20MUST%20start%20with%20the%20base%2D58%2Dbtc%20prefix%20(z)%2C%20as%20defined%20in%20the%20Multibase%20section%20of%20Controller%20Documents%201.0.';
            this.skip('Testing secret keys is out of scope.');
          });
          it('Any other encoding MUST NOT be allowed.',
            async function() {
              this.test.link = 'https://w3c.github.io/vc-di-eddsa/#:~:text=of%20Controller%20Documents%201.0.-,Any%20other%20encoding%20MUST%20NOT%20be%20allowed.,-Developers%20are%20advised%20to%20prevent';
              this.skip('Testing secret keys is out of scope.');
            });
        });
      }
    });
}

export function diProofs({suiteName, match, cryptosuites}) {
  return describe(
    `${suiteName} - Data Model - Proof Representations (DataIntegrityProof)`,
    function() {
      setupMatrix.call(this, match);
      let validVc;
      before(async function() {
        const credentials = await generateTestData();
        validVc = credentials.clone('validVc');
      });
      for(const [columnId, {endpoints}] of match) {
        describe(columnId, function() {
          const [issuer] = endpoints;
          let issuedVc;
          let proofs;
          let eddsa2022Proofs = [];
          before(async function() {
            issuedVc = await createInitialVc({issuer, vc: validVc});
            proofs = getProofs(issuedVc);
            if(proofs?.length) {
              eddsa2022Proofs = proofs.filter(
                proof => cryptosuites.includes(proof?.cryptosuite));
            }
          });
          beforeEach(setupRow);
          const commonAssert = () => {
            should.exist(issuedVc,
              'Expected issuer to have issued a credential.');
            should.exist(proofs,
              'Expected credential to have a proof.');
            eddsa2022Proofs.length.should.be.gte(1,
              'Expected eddsa-jcs-2022 or eddsa-rdfc-2022 cryptosuite.');
          };
          it('The type property MUST be DataIntegrityProof.',
            async function() {
              this.test.link = 'https://w3c.github.io/vc-di-eddsa/#:~:text=The%20type%20property%20MUST%20be%20DataIntegrityProof';
              commonAssert();
              for(const proof of eddsa2022Proofs) {
                should.exist(proof.type,
                  'Expected a type identifier on the proof.');
                proof.type.should.equal('DataIntegrityProof',
                  'Expected DataIntegrityProof type.');
              }
            });
          it('The cryptosuite property of the proof MUST be ' +
            'eddsa-rdfc-2022 or eddsa-jcs-2022.',
          async function() {
            this.test.link = 'https://w3c.github.io/vc-di-eddsa/#:~:text=The%20cryptosuite%20property%20of%20the%20proof%20MUST%20be%20eddsa%2Drdfc%2D2022%20or%20eddsa%2Djcs%2D2022';
            commonAssert();
            for(const proof of eddsa2022Proofs) {
              should.exist(proof.cryptosuite,
                'Expected a cryptosuite identifier on the proof.');
              proof.cryptosuite.should.be.oneOf(cryptosuites,
                'Expected eddsa-rdfc-2022 or eddsa-jcs-2022 cryptosuite.');
            }
          });
          it('The proofValue property of the proof MUST be a detached EdDSA ' +
            'signature produced according to [RFC8032], encoded using the ' +
            'base-58-btc header and alphabet as described in the ' +
            'Multibase section of Controller Documents 1.0.',
          async function() {
            this.test.link = 'https://w3c.github.io/vc-di-eddsa/#:~:text=The%20proofValue%20property%20of%20the%20proof%20MUST%20be%20a%20detached%20EdDSA%20signature%20produced%20according%20to%20%5BRFC8032%5D%2C%20encoded%20using%20the%20base%2D58%2Dbtc%20header%20and%20alphabet%20as%20described%20in%20the%20Multibase%20section%20of%20Controller%20Documents%201.0';
            commonAssert();
            for(const proof of eddsa2022Proofs) {
              should.exist(proof.proofValue,
                'Expected a proof value on the proof.');
              const valueBytes = bs58Decode({id: proof.proofValue});
              should.exist(valueBytes,
                'Expected to have a decoded proofValue.');
            }
          });
        });
      }
    });
}
