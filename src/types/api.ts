import { Credentials } from "google-auth-library";

export interface IRefreshTokenOutput{
    tokens : Credentials
}

export interface ErrorResponse {
    error: string; // -- todo nath , should i handle this in fetchDataEngine
  }