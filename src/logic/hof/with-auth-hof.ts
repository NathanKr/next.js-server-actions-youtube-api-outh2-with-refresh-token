import { redirect } from "next/navigation";
import { checkAndRefreshToken } from "../auth-utils";
import { ServerActionArgs } from "@/types/types";

/**
 Higher-order function that wraps server actions with authentication logic.
 @param serverAction - A server action function that accepts an object of 
 type ServerActionArgs<T> and returns a Promise<R>
 @returns Wrapped server action with authentication check
 */
  export function withAuthHOF<T extends object, R>(
    serverAction: (params: ServerActionArgs<T>) => Promise<R>
  ) {
    return async function (params: T) {
      const { oauth2Client, redirectTo } = await checkAndRefreshToken();
      if (redirectTo) {
        redirect(redirectTo);
        //return null; // Redirection has already been handled
      }
      if (!oauth2Client) {
        throw new Error("OAuth2 client not available. Authentication failed but missing redirectTo");
      }
      const augmentedParams: ServerActionArgs<T> = { ...params, oauth2Client };
      return await serverAction(augmentedParams);
    };
  }
