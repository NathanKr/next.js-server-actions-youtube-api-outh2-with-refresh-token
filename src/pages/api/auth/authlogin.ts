
import { SCOPES } from "@/logic/constants";
import { oauth2Client } from "@/logic/google-utils";
import { NextApiRequest, NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent" // --- added 4/dec/2024 because refresh token was falsy
  });
  res.redirect(authUrl);
}

export default handler;