
import { getUserVideosWithAuth } from "@/actions/actions";
import { FC } from "react";

const VideosPage: FC = async () => {
  const videos = await getUserVideosWithAuth({});
  const videoCount = videos?.length || 0;
  // const videoCount = -999;

  return (
    <div>
      <h1>User Videos</h1>
      <p>Total videos: {videoCount}</p>
    </div>
  );
};

export default VideosPage;
