
import { getUserVideos } from "@/logic/google-utils";
import { FC } from "react";

const VideosPage: FC = async ({
  oauth2Client,
}) => {
  const videos = await getUserVideos(oauth2Client);
  const videoCount = videos?.length || 0;

  return (
    <div>
      <h1>User Videos</h1>
      <p>Total videos: {videoCount}</p>
    </div>
  );
};

export default VideosPage;
