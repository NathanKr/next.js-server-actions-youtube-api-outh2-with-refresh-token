import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse, IRefreshTokenOutput } from "@/types/api";
import { Credentials } from "google-auth-library";
import { z } from "zod";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes"; // Import HTTP status codes
import { googleTokenResponseSchema } from "@/logic/zod-schema";
import { ApiUrl } from "@/types/enums";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IRefreshTokenOutput | ErrorResponse>
) {
  try {
    console.log(`Enter ${ApiUrl.RefreshToken}`);
    const {refreshToken} = req.body; // --- not able to get it from getIronSessionDefaultMaxAge , i do not know why but i get it in the body

    if (!refreshToken) {
      return res
        .status(StatusCodes.UNAUTHORIZED) // Use named constant
        .json({ error: "Unauthorized: No refresh token found" });
    }

    const url = `https://oauth2.googleapis.com/token`; // Google token endpoint

    const response = await axios.post(url, {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
    });

    // Validate the response data using Zod schema
    const parsedData = googleTokenResponseSchema.parse(response.data);
    console.log(`Got fresh and valid accessToken`);
    
    const { access_token, expires_in, token_type, id_token, scope } =
      parsedData;

    const newTokens: Credentials = {
      access_token,
      expiry_date: Date.now() + expires_in * 1000,
      token_type,
      id_token,
      scope,
      refresh_token: refreshToken, // Keep the refresh token if it's not provided
    };

    const output: IRefreshTokenOutput = {
      tokens: newTokens,
    };

    return res.status(StatusCodes.OK).json(output); // Use named constant for OK (200)
  } catch (error) {
    return handleError(error, res);
  }
}

function handleError(error: unknown, res: NextApiResponse) {
  if (error instanceof z.ZodError) {
    console.error("Validation error:", error.errors);
    return res
      .status(StatusCodes.BAD_REQUEST) // Use named constant for bad request (400)
      .json({ error: "Invalid response format" });
  } else if (error instanceof AxiosError) {
    console.error(
      "Axios error response data:",
      error.response?.data || error.message
    );
    return res
      .status(error.response?.status || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        error: error.response?.data || "Failed to refresh access token",
      });
  } else if (error instanceof Error) {
    console.error("Error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR) // Use named constant for internal server error (500)
      .json({ error: error.message });
  } else {
    console.error("Unknown error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR) // Use named constant for internal server error (500)
      .json({ error: "An unknown error occurred" });
  }
}
