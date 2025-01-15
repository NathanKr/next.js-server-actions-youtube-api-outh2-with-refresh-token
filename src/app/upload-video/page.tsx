import withAuthHOC, {
  ServerComponentWithOauth2ClientProps,
} from "@/components/hoc/with-auth";
import { uploadVideo } from "@/logic/google-utils";
import { OAuth2Client } from "google-auth-library";
import { resolve } from "path";
import { FC, Suspense, use } from "react";

async function loadUploadVideo(oauth2Client: OAuth2Client): Promise<{
  uploaded: boolean;
  title: string;
}> {
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
}

const UploadVideo: FC<ServerComponentWithOauth2ClientProps> = ({
  oauth2Client,
}) => {
  const dataPromise = loadUploadVideo(oauth2Client);

  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <VideoResult dataPromise={dataPromise} />
    </Suspense>
  );
};

const VideoResult = ({
  dataPromise,
}: {
  dataPromise: Promise<{ uploaded: boolean; title: string }>;
}) => {
  const { uploaded, title } = use(dataPromise);

  return (
    <h1>
      UploadVideo {title} with oauth2Client: {uploaded ? "success" : "failure"}
    </h1>
  );
};

export default withAuthHOC(UploadVideo);
