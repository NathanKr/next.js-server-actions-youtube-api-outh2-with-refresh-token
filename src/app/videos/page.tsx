import { getUserVideosWithAuth } from "@/actions/actions";
import { FC, Suspense } from "react";

// --- server component

const Videos: FC = async () => {
  try {
    const videos = await getUserVideosWithAuth({});
    const videoCount = videos?.length || 0;

    return (
      <div>
        <h1>User Videos</h1>
        <p>Total videos: {videoCount}</p>
      </div>
    );
  } catch (error) {
    console.error("Error fetching user videos:", error);
    return (
      <div>
        <h1>User Videos</h1>
        <p>Failed to load videos. Please try again later.</p>
      </div>
    );
  }
};

const VideosPage: FC = () => {
  return (
    <Suspense fallback={<p>Loading ...</p>}>
      <Videos />
    </Suspense>
  );
};

export default VideosPage;

