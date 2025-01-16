"use server"

import { uploadVideo } from "@/logic/google-utils";
import { withAuthHOF } from "@/logic/hof/with-auth-hof";
import { OAuth2Client } from "google-auth-library";
import { resolve } from "path";

// -- actions should have args : ServerActionArgs , return R

// --- todo nath : match using object (see readme)
const loadUploadVideo = async (oauth2Client: OAuth2Client): Promise<{
  uploaded: boolean;
  title: string;
}> => {
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

const loadUploadVideoWithAuth = withAuthHOF(loadUploadVideo);
export { loadUploadVideoWithAuth };