/**
 * 1) User clicks signin or signup button and is redirected to the cognito hosted UI.
 * 2) User completes the signin or registration steps and is redirected back to callbackURL
 * 3) frontend recieves the jwt token and sends it to backend and based on the userid being present in the database or not => either a new user is created or his details are sent if already present.
 */
import jwkToPem from "jwk-to-pem";
import jwt from "jsonwebtoken";
import { SECRETS } from "./config.js";
import axios from "axios";
import {
  CognitoUserPool,
  CognitoRefreshToken,
  CognitoUser,
} from "amazon-cognito-identity-js";
import fetch from "node-fetch";

global.fetch = fetch;
const {
  region,
  userPool,
  clientId: _clientId,
  clientSecret,
  auth_domain,
  redirect_uri,
} = SECRETS;
const { decode, verify, TokenExpiredError } = jwt;
const TOKEN_USE_ACCESS = "access";
const TOKEN_USE_ID = "id";
const poolData = {
  UserPoolId: userPool,
  ClientId: _clientId,
};

const MAX_TOKEN_AGE = 60 * 60; // 3600 seconds
const ALLOWED_TOKEN_USES = [TOKEN_USE_ACCESS, TOKEN_USE_ID];
const ISSUER = `https://cognito-idp.${region}.amazonaws.com/${userPool}`;

class AuthError extends Error {}

// Get the middleware function that will verify the incoming request
async function _getVerifyMiddleware() {
  // Fetch the JWKS data used to verify the signature of incoming JWT tokens
  try {
    const pemsDownloadProm = await _init();
    return function (req, res, next) {
      _verifyMiddleWare(pemsDownloadProm, req, res, next);
    };
  } catch (err) {
    // Failed to get the JWKS data - all subsequent auth requests will fail
    console.error(err);
    return { err };
  }
}

// One time initialisation to download the JWK keys and convert to PEM format. Returns a promise.
function _init() {
  return new Promise(async (resolve, reject) => {
    const url = `${ISSUER}/.well-known/jwks.json`;
    try {
      const resp = await axios.get(url);
      const body = resp.data;
      if (!body || !body.keys) {
        console.debug(
          `JWKS data is not in expected format. Response was: ${JSON.stringify(
            resp
          )}`
        );
        reject(new Error("Internal error occurred downloading JWKS data.")); // don't return detailed info to the caller
        return;
      }
      const pems = {};
      body.keys.map((item) => {
        pems[item.kid] = jwkToPem(item);
      });

      console.info(`Successfully downloaded ${body.keys.length} JWK key(s)`);
      resolve(pems);
    } catch (err) {
      console.debug(`Failed to download JWKS data. err: ${err}`);
      reject(new Error("Internal error occurred downloading JWKS data.")); // don't return detailed info to the caller
      return;
    }
  });
}

// Verify the Authorization header and call the next middleware handler if appropriate
async function _verifyMiddleWare(pemsDownloadProm, req, res, next) {
  // console.log(pemsDownloadProm);
  try {
    const decoded = await _verifyProm(
      pemsDownloadProm,
      req.get("Authorization")
    );
    console.debug(`Valid JWT token. Decoded: ${JSON.stringify(decoded)}.`);
    req.user = {
      sub: decoded.sub,
      token_use: decoded.token_use,
    };
    if (decoded.token_use === TOKEN_USE_ACCESS) {
      // access token specific fields
      req.user.scope = decoded.scope.split(" ");
      req.user.username = decoded.username;
    }
    if (decoded.token_use === TOKEN_USE_ID) {
      // id token specific fields
      req.user.email = decoded.email;
      req.user.username = decoded["cognito:username"];
      req.user.given_name = decoded.given_name;
      req.user.family_name = decoded.family_name;
    }
    next();
  } catch (err) {
    const status = err instanceof AuthError ? 401 : 500; // Either not auth or internal error
    res.status(status).send(err.message || err);
  }
}

// Verify the Authorization header and return a promise.
function _verifyProm(pems, auth) {
  return new Promise((resolve, reject) => {
    if (pems.err) {
      reject(new Error(pems.err.message || pems.err));
      return;
    }

    // Check the format of the auth header string and break out the JWT token part
    if (!auth || auth.length < 10) {
      reject(
        new AuthError(
          "Invalid or missing Authorization header. Expected to be in the format 'Bearer <your_JWT_token>'."
        )
      );
      return;
    }
    // console.log(auth);
    const authPrefix = auth.toLowerCase().split(" ")[0];
    if (authPrefix !== "bearer") {
      reject(
        new AuthError(
          "Authorization header is expected to be in the format 'Bearer <your_JWT_token>'."
        )
      );
      return;
    }
    const token = auth.substring(7);

    // Decode the JWT token so we can match it to a key to verify it against
    const decodedNotVerified = decode(token, { complete: true });
    if (!decodedNotVerified) {
      console.debug(`Invalid JWT token. jwt.decode() failure.`);
      reject(
        new AuthError("Authorization header contains an invalid JWT token.")
      ); // don't return detailed info to the caller
      return;
    }
    if (
      !decodedNotVerified.header.kid ||
      !pems[decodedNotVerified.header.kid]
    ) {
      console.debug(
        `Invalid JWT token. Expected a known KID ${JSON.stringify(
          Object.keys(pems)
        )} but found ${decodedNotVerified.header.kid}.`
      );
      reject(
        new AuthError("Authorization header contains an invalid JWT token.")
      ); // don't return detailed info to the caller
      return;
    }

    // Now verify the JWT signature matches the relevant key
    verify(
      token,
      pems[decodedNotVerified.header.kid],
      {
        issuer: ISSUER,
        maxAge: MAX_TOKEN_AGE,
      },
      function (err, decodedAndVerified) {
        if (err) {
          console.debug(`Invalid JWT token. jwt.verify() failed: ${err}.`);
          if (err instanceof TokenExpiredError) {
            reject(
              new AuthError(
                `Authorization header contains a JWT token that expired at ${err.expiredAt.toISOString()}.`
              )
            );
          } else {
            reject(
              new AuthError(
                "Authorization header contains an invalid JWT token."
              )
            ); // don't return detailed info to the caller
          }
          return;
        }

        // The signature matches so we know the JWT token came from our Cognito instance, now just verify the remaining claims in the token

        // Verify the token_use matches what we've been configured to allow
        if (ALLOWED_TOKEN_USES.indexOf(decodedAndVerified.token_use) === -1) {
          console.debug(
            `Invalid JWT token. Expected token_use to be ${JSON.stringify(
              ALLOWED_TOKEN_USES
            )} but found ${decodedAndVerified.token_use}.`
          );
          reject(
            new AuthError("Authorization header contains an invalid JWT token.")
          ); // don't return detailed info to the caller
          return;
        }

        // Verify the client id matches what we expect. Will be in either the aud or the client_id claim depending on whether it's an id or access token.
        const clientId = decodedAndVerified.aud || decodedAndVerified.client_id;
        if (clientId !== _clientId) {
          console.debug(
            `Invalid JWT token. Expected client id to be ${_clientId} but found ${clientId}.`
          );
          reject(
            new AuthError("Authorization header contains an invalid JWT token.")
          ); // don't return detailed info to the caller
          return;
        }

        // Done - all JWT token claims can now be trusted
        return resolve(decodedAndVerified);
      }
    );
  });
}

export const generateTokensfromCode = async (req, res) => {
  const { code } = req.body;
  console.log(code);
  try {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      client_id: _clientId,
      redirect_uri: redirect_uri,
    });

    const config = {
      auth: {
        username: _clientId,
        password: clientSecret,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const resp = await axios.post(
      `https://${auth_domain}/oauth2/token`,
      params,
      config
    );
    const data = resp.data;
    console.log(data);
    res.json({ status: "OK", data: data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error generating tokens" });
  }
};

export const renewToken = async (req, res) => {
  let token = req.body.refresh_token;
  console.log(token);
  if (!token) {
    return res.status(401).end();
  }
  try {
    const params = {
      ClientId: _clientId,
      AuthFlow: "REFRESH_TOKEN_AUTH",
      AuthParameters: {
        REFRESH_TOKEN: token,
        SECRET_HASH: clientSecret, // In case you have configured client secret
      },
    };

    const config = {
      headers: {
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
        "Content-Type": "application/x-amz-json-1.1",
      },
    };

    const resp = await axios.post(
      `https://cognito-idp.${region}.amazonaws.com/`,
      params,
      config
    );
    res.json({ status: "OK", data: resp.data.AuthenticationResult });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error refreshing token" });
  }
};

export const getVerifyMiddleware = _getVerifyMiddleware;
