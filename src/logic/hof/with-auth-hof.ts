import { redirect } from "next/navigation";
import { checkAndRefreshToken } from "../auth-utils";
import { ServerActionArgs } from "@/types/types";

export function withAuthHOF<T extends object, R>(
  serverAction: (params: ServerActionArgs<T>) => Promise<R>
) {
  return async function (params: ServerActionArgs<T>) {
    const { oauth2Client, redirectTo } = await checkAndRefreshToken();
    if (redirectTo) {
      redirect(redirectTo);
      return null; // Redirection has already been handled
    }
    if (!oauth2Client) {
      return null; // Ensure function stops if redirection is needed
    }
    return await serverAction({ ...params });
  };
}

