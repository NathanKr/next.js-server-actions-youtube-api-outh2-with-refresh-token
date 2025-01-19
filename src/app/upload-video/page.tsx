"use client"

import { FC, useState } from "react";
import { loadUploadVideoWithAuth } from "@/actions/actions";

const UploadVideo: FC = () => {
  const [title, setTitle] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpload = async () => {
    setLoading(true);
    try {
      const result = await loadUploadVideoWithAuth({});
      if (result) {
        setTitle(result.title);
        setUploaded(result.uploaded);
      } else {
        setTitle(null);
        setUploaded(null);
      }
    } catch (error) {
      console.error("Failed to upload video:", error);
      setTitle(null);
      setUploaded(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Video"}
      </button>
      {title !== null && (
        <h1>
          UploadVideo {title} with oauth2Client: {uploaded ? "success" : "failure"}
        </h1>
      )}
    </div>
  );
};

export default UploadVideo;
