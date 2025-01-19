import { OAuth2Client } from "google-auth-library";
import { oauth2_v2, youtube_v3 } from "googleapis";

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


type EmptyParams = Record<string, never>; // -- define empty object instead {} which  issue warning


// --- upload video

export type UploadVideoParams = EmptyParams; // Define any additional parameters if needed

export interface UploadVideoResult {
  uploaded: boolean;
  title: string;
}

// --- get user videos
export type UserVideosParams = EmptyParams; // Define any additional parameters if needed
export type UserVideosResult = youtube_v3.Schema$SearchResult[] | undefined
