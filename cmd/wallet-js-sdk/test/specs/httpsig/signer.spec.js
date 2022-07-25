/*
Copyright SecureKey Technologies Inc. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

import { expect } from "chai";
import { HTTPSigner } from "../../../src";

describe("HTTP Signature Client", function () {
  it("success constructing signer instance", async () => {
    const mockSigningKey = {
      publicKey: "kock-public-key",
      privateKey: "mock-private-key",
    };
    const signer = new HTTPSigner({ mockSigningKey });

    expect(result.status).to.be.equal(200);
    expect(result.data).to.be.equal(expectedResp);
  });
});
