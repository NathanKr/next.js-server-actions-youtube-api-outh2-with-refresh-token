"use server";

import { getUserVideos, loadUploadVideo } from "@/logic/google-utils";
import { withAuthHOF } from "@/logic/hof/with-auth-hof";
import {
  UploadVideoParams,
  UploadVideoResult,
  UserVideosParams,
  UserVideosResult,
} from "@/types/types";



const loadUploadVideoWithAuth = withAuthHOF<
  UploadVideoParams,
  UploadVideoResult
>(loadUploadVideo);

const getUserVideosWithAuth = withAuthHOF<UserVideosParams, UserVideosResult>(
  getUserVideos
);

export { loadUploadVideoWithAuth, getUserVideosWithAuth };
  
