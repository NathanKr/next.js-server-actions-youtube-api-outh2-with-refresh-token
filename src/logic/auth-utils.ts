import { cookies } from "next/headers";
import { isAccessTokenExpired, oauth2Client } from "@/logic/google-utils";
import { getIronSessionByCookiesDefaultMaxAge } from "@/logic/iron-session-utils";
import { ApiUrl, LoginStatus, Pages } from "@/types/enums";
import axios from "axios";
import { IRefreshTokenOutput } from "@/types/api";
import { concatUrls } from "./gen-utils";
import { getServerUrl } from "./project-utils";
import { OAuth2Client } from "google-auth-library";

export async function checkAndRefreshToken(): Promise<{
  oauth2Client: OAuth2Client | null;
  redirectTo?: string;
}> {
  try {
    const cookieStore = cookies();
    const session = await getIronSessionByCookiesDefaultMaxAge(cookieStore);

    const { accessToken } = session;

    if (!accessToken) {
      return {
        oauth2Client: null,
        redirectTo: `${Pages.Login}/?status=${LoginStatus.LoginRequired}`,
      };
    }

    oauth2Client.setCredentials({ access_token: accessToken });

    const accessTokenExpired = await isAccessTokenExpired(accessToken);
    if (accessTokenExpired) {
      const fullUrl = concatUrls(getServerUrl(), ApiUrl.RefreshToken);
      const response = await axios.post(fullUrl, {
        refreshToken: session.refreshToken,
      });

      const newTokens = (response.data as IRefreshTokenOutput).tokens;
      if (!newTokens || !newTokens.access_token) {
        console.error("Invalid refresh token response:", response.data);
        return {
          oauth2Client: null,
          redirectTo: `${Pages.Login}/?status=${LoginStatus.LoginRequired}`,
        };
      }
      oauth2Client.setCredentials(newTokens);

      session.accessToken = newTokens.access_token;
      await session.save();
    }

    return { oauth2Client };
  } catch (error) {
    console.error("Error in checkAndRefreshToken:", error);
    return {
      oauth2Client: null,
      redirectTo: `${Pages.Login}/?status=${LoginStatus.LoginRequired}`,
    };
  }
}
