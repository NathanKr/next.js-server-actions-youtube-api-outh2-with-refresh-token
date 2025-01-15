import { getIronSessionDefaultMaxAge } from "@/logic/iron-session-utils";
import { userInfoSchema } from "@/logic/zod-schema";
import { ErrorResponse } from "@/types/api";
import { TUserInfo } from "@/types/types";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TUserInfo | ErrorResponse>
) {
  try {
    const session = await getIronSessionDefaultMaxAge(req, res);
    const { userInfo } = session;
    userInfoSchema.parse(userInfo); // -- i prefer to parse here and not in oauth2callback
    res.status(StatusCodes.OK).json(userInfo);
  } catch (error) {
    let errorMessage = "An unknown error occurred";

    if (error instanceof z.ZodError) {
      errorMessage = `Invalid user info: ${JSON.stringify(error.errors)}`;
      res.status(StatusCodes.BAD_REQUEST).json({ error: errorMessage });
    } else if (error instanceof Error) {
      errorMessage = error.message;
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: `Failed to retrieve user email: ${errorMessage}` });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: errorMessage });
    }
  }
}
