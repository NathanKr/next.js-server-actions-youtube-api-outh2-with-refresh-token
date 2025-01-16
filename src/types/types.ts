import { OAuth2Client } from "google-auth-library";
import { oauth2_v2 } from "googleapis";

export type TUserInfo = oauth2_v2.Schema$Userinfo;

export interface IronSessionData {
  accessToken: string;
  refreshToken: string;
  userInfo: TUserInfo;
}

export interface ServerActionWithOauth2ClientArgs {
  oauth2Client: OAuth2Client;
}

// Define a generic type that combines T with ServerActionWithOauth2ClientArgs
export type ServerActionArgs<T extends object> = T &
  ServerActionWithOauth2ClientArgs;
