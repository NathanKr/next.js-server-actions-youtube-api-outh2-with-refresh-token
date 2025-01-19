export enum LoginStatus {
  LoginSuccess,
  LoginFailure,
  LoginRequired,
}

export enum Pages {
  Login = "/auth/login",
  Home = "/",
  Videos = "/videos",
  UploadVideo = "/upload-video",
  DebugClearSession = "/debug-clear-session",
}

export enum ApiUrl {
  Login = "/api/auth/authlogin",
  AuthCallback = "/api/auth/oauth2callback", // not used by this enum, call from auth
  RefreshToken = "/api/auth/refresh-token",
  UserInfo = "/api/user-info",
}
