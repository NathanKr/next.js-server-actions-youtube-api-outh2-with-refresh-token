"use server";

import { uploadVideo } from "@/logic/google-utils";
import { withAuthHOF } from "@/logic/hof/with-auth-hof";
import {
  UploadVideoParams,
  UploadVideoResult,
  UserVideosParams,
  UserVideosResult,
} from "@/types/types";
import { resolve } from "path";
import { ServerActionArgs } from "@/types/types";
import { google } from "googleapis";

const loadUploadVideo = async ({
  oauth2Client,
}: ServerActionArgs<UploadVideoParams>): Promise<UploadVideoResult> => {
  const filePath = resolve(".", "data", "SampleVideo_1280x720_1mb.mp4");
  const timestampMs = Date.now();
  const title = `title_${timestampMs}`;
  const description = `description_${timestampMs}`;
  const tags = [`tag1_${timestampMs}`, `tag2_${timestampMs}`];

  const uploaded = await uploadVideo(
    oauth2Client,
    filePath,
    title,
    description,
    tags
  );
  return { uploaded, title };
};

export async function getUserVideos({
  oauth2Client,
}: ServerActionArgs<UserVideosParams>): Promise<UserVideosResult> {
  const youtubeV3 = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  try {
    // Step 1: Get the user's channel ID
    const channelResponse = await youtubeV3.channels.list({
      part: ["id"],
      mine: true,
    });

    const channelId = channelResponse.data.items?.[0]?.id;

    if (!channelId) {
      throw new Error("User's channel not found");
    }

    // Step 2: Use the channel ID to list videos
    const videoResponse = await youtubeV3.search.list({
      part: ["snippet"],
      channelId: channelId,
      maxResults: 10,
      order: "date", // You can customize this based on your needs
    });

    return videoResponse.data.items;
  } catch (error) {
    console.error("Error fetching user videos:", error);
    throw error;
  }
}

const loadUploadVideoWithAuth = withAuthHOF<
  UploadVideoParams,
  UploadVideoResult
>(loadUploadVideo);

const getUserVideosWithAuth = withAuthHOF<UserVideosParams, UserVideosResult>(
  getUserVideos
);

export { loadUploadVideoWithAuth, getUserVideosWithAuth };
