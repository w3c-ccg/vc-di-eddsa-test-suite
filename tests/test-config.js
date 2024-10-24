/*!
 * Copyright (c) 2022-2024 Digital Bazaar, Inc.
 * SPDX-License-Identifier: BSD-3-Clause
 */

// FIXME: Currently uses 'Grotto Networking' as default issuer to issue a
// verifiable credential for the `eddsa-jcs-2022` verifier tests.
// This needs to be updated in future to use either Digital Bazaar
// or generate the vc using `vc-generator` helper.
export const issuerNameJCS = process.env.ISSUER_NAME_JCS || 'Grotto Networking';
