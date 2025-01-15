import { z } from "zod";

// Define Zod schema for Google OAuth2 token response
export const googleTokenResponseSchema = z.object({
  access_token: z.string().min(1, "Access token cannot be empty"),
  expires_in: z.number(),
  token_type: z.string().min(1, "Token type cannot be empty"),
  id_token: z.string().min(1, "ID token cannot be empty").optional(),
  scope: z.string().min(1, "Scope cannot be empty"),
});

export const userInfoSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  verified_email: z.boolean(),
  name: z.string(),
  given_name: z.string(),
  family_name: z.string(),
  picture: z.string().url(),
  locale: z.string().optional(), // --- this is optional
});