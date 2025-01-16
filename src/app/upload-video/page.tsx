import { loadUploadVideoWithAuth } from "@/actions/actions";
import { ServerActionWithOauth2ClientProps } from "@/components/hoc/with-auth";
import { FC } from "react";

const UploadVideo: FC<ServerActionWithOauth2ClientProps> = async ({
  oauth2Client,
}) => {
  const { uploaded, title } =  await loadUploadVideoWithAuth({});

  return (
    <h1>
      UploadVideo {title} with oauth2Client: {uploaded ? "success" : "failure"}
    </h1>
  );
};

export default UploadVideo;
