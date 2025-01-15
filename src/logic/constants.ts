export const COOKIE_NAME = "myCookie";
export const MAX_AGE_SEC = 60 * 60 * 24 * 7; // -- one week

export const SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload", // required for youtube.videos.insert and youtube.thumbnails.set,
  "https://www.googleapis.com/auth/youtube.readonly", // -- require to get video list
  "https://www.googleapis.com/auth/userinfo.profile", // -- require to get user profile
  "https://www.googleapis.com/auth/userinfo.email", // -- require to get user email
];
