import { oauth2_v2 } from "googleapis";

export type TUserInfo = oauth2_v2.Schema$Userinfo;

export interface IronSessionData {
  accessToken : string; 
  refreshToken : string; 
  userInfo : TUserInfo;
  }


