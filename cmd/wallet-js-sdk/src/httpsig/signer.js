/*
Copyright SecureKey Technologies Inc. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

import { fromUint8Array } from "js-base64";

export class HTTPSigner {
  constructor({ authorization = "", signingKey }) {
    if (!signingKey)
      throw new Error(
        "Error initializing HTTPSigner: signingKey cannot be empty"
      );
    this.authorization = authorization;
    this.signingKey = signingKey;
  }

  // Generates and returns Signature-Input header string
  generateSignatureParams() {
    const created = Math.floor(Date.now() / 1000);

    const signatureParams = `("@method" "@target-uri" "content-digest"${
      this.authorization && ' "authorization"'
    });created=${created};keyid="${this.signingKey.kid}"`;

    console.log("Generated signatureParams:", signatureParams);

    return signatureParams;
  }

  getSignatureInput(name, sigParams) {
    if (!name)
      throw new Error("Error getting signature input: name is required");
    return `${name}=${sigParams}`;
  }

  // Returns "httpsig", the GNAP proof type of the http-signature proof method.
  proofType() {
    return "httpsig";
  }

  // Generates and returns http signature for the request provided
  async sign(digest, url, name, sigParams) {
    console.log("sign privateKey", this.signingKey.privateKey);

    const method = "POST";

    // TODO add authorization
    const signatureBase = this.authorization
      ? `"@method": ${method}\n"@target-uri": ${url}\n"content-digest": ${digest}\n"authorization": GNAP ${this.authorization}\n"@signature-params": ${sigParams}`
      : `"@method": ${method}\n"@target-uri": ${url}\n"content-digest": ${digest}\n"@signature-params": ${sigParams}`;
    console.log("signatureBase", signatureBase);

    const encoder = new TextEncoder();
    const encodedSignatureBase = encoder.encode(signatureBase);

    const sigBuffer = await window.crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      this.signingKey.privateKey,
      encodedSignatureBase
    );

    console.log("Generated sigBuffer:", sigBuffer);

    // convert buffer to byte array
    const sigArray = new Uint8Array(sigBuffer);
    console.log("sigArray", sigArray);
    // Encode byte array with base64
    const encodedSig = fromUint8Array(sigArray);
    console.log("encodedSig", encodedSig);

    return `${name}=:${encodedSig}:`;
  }
}
