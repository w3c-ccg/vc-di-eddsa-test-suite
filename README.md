# [EdDSA](https://www.w3.org/TR/vc-di-eddsa/) Cryptosuite test suite

Provides interoperability tests for Verifiable Credential processors
(Issuers and Verifiers) that support [EdDSA](https://www.w3.org/TR/vc-di-eddsa/)
and [Data Integrity](https://www.w3.org/TR/vc-data-integrity/) cryptosuites.

- [Install](#install)
- [Usage](#usage)
    - [Wrapping Your Implementation](#wrapping-your-implementation)
    - [Testing Locally](#testing-locally)
    - [Running Specific Tests](#running-specific-tests)
- [Adding a Public Implementation](#adding-a-public-implementation)
- [License](#license)

## Install

```js
npm i
```

## Usage

To generate test data for `eddsa-jcs-2022` tests, testers can specify the
issuer name using the environment variable `ISSUER_NAME_JCS`.

If `$ISSUER_NAME_JCS` is not specified, `bovine` will be used.
```sh
ISSUER_NAME_JCS="IssuerNameJCS"  npm test
```

### Wrapping Your Implementation

A simplified version of issuer and verifier endpoints from
[VC API](https://w3c-ccg.github.io/vc-api/)
are used by the test suite code to communicate with the underlying cryptosuite.
The credentials MUST use the `DataIntegrityProof` proof type and implement the
`eddsa-rdfc-2022` and/or `eddsa-jcs-2022` cryptosuites.

A community example implementation (written in Node.js/Express) is available at
https://github.com/Wind4Greg/Server-for-VCs

The typical server will implement the following endpoints and methods:
```http
POST /credentials/issue
Content-Type: application/ld+json

{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://w3id.org/security/data-integrity/v2"
  ],
  "credential": {},
  "options": {}
}
```

```http
POST /credentials/verify
Content-Type: application/ld+json

{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://w3id.org/security/data-integrity/v2"
  ],
  "verifiableCredential": {
    "proof": {}
  }
}
```

```http
POST /credentials/derive
Content-Type: application/ld+json

{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://w3id.org/security/data-integrity/v2"
  ],
  "verifiableCredential": {
    "proof": {}
  }
}
```

### Testing Locally
If you want to test implementations or just endpoints running locally, you can
copy `localConfig.example.cjs` to `localConfig.cjs`
in the root directory of the test suite.

```bash
cp localConfig.example.cjs localConfig.cjs
```

Git is set to ignore `localConfig.cjs` by default.

This file must be a CommonJS module that exports an array of implementations:

```js
// .localConfig.cjs defining local implementations
// you can specify a BASE_URL before running the tests such as:
// BASE_URL=http://localhost:40443/zDdfsdfs npm test
const baseUrl = process.env.BASE_URL || 'https://localhost:40443/id';
module.exports = {
  settings: {
    enableInteropTests: false, // default
    testAllImplementations: false // default
  },
  implementations: [{
    name: 'My Company',
    implementation: 'My Implementation Name',
    issuers: [{
      id: 'did:myMethod:implementation:issuer:id',
      endpoint: `${baseUrl}/credentials/issue`,
      supports: {
        vc: ['1.1', '2.0']
      },
      tags: ['eddsa-rdfc-2022', 'localhost']
    }],
    verifiers: [{
      id: 'did:myMethod:implementation:verifier:id',
      endpoint: `${baseUrl}/credentials/verify`,
      tags: ['eddsa-rdfc-2022', 'localhost']
    }]
  }];
}
```
To specifically test only the implementations in `localConfig.cjs`, change
`settings.testAllImplementations` to `false`.

### Running Specific Tests
This suite uses [mocha.js](https://mochajs.org) as the test runner.
Mocha has [multiple options](https://mochajs.org/#command-line-usage) for filtering which tests run.

For example, the snippet below uses grep to filter tests by name and only runs one of the test suites.
```bash
mocha --grep '"specificProperty" test name' ./tests/10-specific-test-suite.js
```

## Adding a Public Implementation

To [add your implementation to the public list of tested implementations](https://github.com/w3c/vc-test-suite-implementations/tree/main?tab=readme-ov-file#adding-a-new-implementation),
you will need to add 2 endpoints to your implementation manifest:
- A credential issuer endpoint (ex: `/credentials/issue`) in the `issuers` property.
- A credential verifier endpoint (ex: `/credentials/verify`) in the `verifiers`
  property.

All endpoints will need the tags either `eddsa-rdfc-2022` or `eddsa-jcs-2022`.

A simplified manifest would look like this:

```json
{
  "name": "My Company",
  "implementation": "My implementation",
  "issuers": [{
    "id": "",
    "endpoint": "https://issuer.mycompany.com/credentials/issue",
    "method": "POST",
    "tags": ["eddsa-rdfc-2022"]
  }, {
    "id": "",
    "endpoint": "https://issuer.mycompany.com/credentials/issue",
    "method": "POST",
    "tags": ["eddsa-jcs-2022"]
  }],
  "verifiers": [{
    "id": "",
    "endpoint": "https://verifier.mycompany.com/credentials/verify",
    "method": "POST",
    "tags": ["eddsa-rdfc-2022", "eddsa-jcs-2022"]
  }]
}
```

The example above represents an unauthenticated endpoint. You may add ZCAP or
OAuth2 authentication to your endpoints. You can find an example in the
[w3c/vc-test-suite-implementations README](https://github.com/w3c/vc-test-suite-implementations#adding-a-new-implementation).

To run the tests, some implementations may require client secrets that can be
passed as environment variables to the test script. To see which implementations require client
secrets, please check the implementation manifest within the
[w3c/vc-test-suite-implementations](https://github.com/w3c/vc-test-suite-implementations/tree/main/implementations) repo.

## License

[BSD-3-Clause](LICENSE.md)
