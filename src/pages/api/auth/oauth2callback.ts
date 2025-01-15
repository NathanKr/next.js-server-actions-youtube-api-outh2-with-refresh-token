// --- api/oauth2callback
import jwt, { JwtPayload } from "jsonwebtoken";
import { SCOPES } from "@/logic/constants";
import {
  getAuthenticatedUserInfo,
  isAccessTokenExpired,
  oauth2Client,
} from "@/logic/google-utils";
import {
  getIronSessionDefaultMaxAge,
  logout,
} from "@/logic/iron-session-utils";
import { LoginStatus, Pages } from "@/types/enums";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { Credentials } from "google-auth-library";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // --- got the code from /api/auth/authlogin
  const { code } = req.query as { code?: string }; // Type the query parameters
  console.log(`code : ${code}`);

  if (!code) {
    res.status(StatusCodes.BAD_REQUEST).send("Missing authorization code");
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    const { access_token, refresh_token } = tokens;

    debugPrintAccesstokenProperties(tokens);

    if (!access_token || !refresh_token) {
      console.error("tokens info is not complete");
      console.log(
        `${access_token ? "access_token truty" : "access_token falsy"}`
      );
      console.log(
        `${refresh_token ? "refresh_token truty" : "refresh_token falsy"}`
      );
      res.redirect(`${Pages.Login}?status=${LoginStatus.LoginFailure}`);
      return;
    }

    oauth2Client.setCredentials(tokens);
    const userInfo = await getAuthenticatedUserInfo(oauth2Client); // --- i do not want to check validation here i will do it when access the info

    let session = await getIronSessionDefaultMaxAge(req, res);
    logout(session);
    session = await getIronSessionDefaultMaxAge(req, res);

    session.accessToken = access_token;
    session.refreshToken = refresh_token;
    session.userInfo = userInfo;
    await session.save(); // --- encrypt the session data and set cookie

    res.redirect(`${Pages.Login}?status=${LoginStatus.LoginSuccess}`);
    return;
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({});
    return;
  }
}

async function debugPrintAccesstokenProperties(tokens: Credentials) {
  const { scope, id_token, access_token, refresh_token } = tokens;

  if (scope) {
    console.log(`\n--- scope info ---`);
    const scopes = scope.split(" "); // Converts the space-separated string into an array
    console.log("scopes returned");
    console.log(scopes);
    console.log("scopes required");
    const requiredScopes = SCOPES;
    console.log(requiredScopes);
    // Check if every required scope is present in the returned scopes
    const allScopesMatch = requiredScopes.every((reqScope) =>
      scopes.includes(reqScope)
    );
    if (allScopesMatch) {
      console.log("All required scopes are present.");
    } else {
      console.log("Some required scopes are missing.");
    }
    // Check if every required scope is present in the returned scopes const allScopesMatch = requiredScopes.every(reqScope => scopes.includes(reqScope)); if (allScopesMatch) { console.log("All required scopes are present."); } else { console.log("Some required scopes are missing."); }
  } else {
    console.error("No scope returned");
  }

  if (id_token) {
    console.log(`\n--- id_token info ---`);

    // --- id_token is a JSON Web Token (JWT) issued by an identity provider
    // --- (like Google) during an OAuth 2.0 authentication process
    console.log("info from id_token using jwt");

    const decoded = jwt.decode(id_token) as JwtPayload;
    console.log("Decoded ID Token:", decoded);
    console.log("Email:", decoded?.["email"] || "Email not present");
    console.log(
      "Email Verified:",
      decoded?.["email_verified"] !== undefined
        ? decoded["email_verified"]
        : "Not verified"
    );
  } else {
    console.error("ID Token is missing.");
  }

  if (access_token) {
    console.log(`\n--- access_token info ---`);

    // -- should not be expired
    const access_token_expired = await isAccessTokenExpired(access_token);
    console.log(`access_token expired : ${access_token_expired}`);
  } else {
    console.error("access_token is missing.");
  }

  if (refresh_token) {
    console.log(`\n--- refresh_token info ---`);
    console.log(refresh_token);
  } else {
    console.error("refresh_token is missing.");
  }
}
