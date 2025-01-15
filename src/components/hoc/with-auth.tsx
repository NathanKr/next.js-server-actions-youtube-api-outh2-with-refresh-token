import { checkAndRefreshToken } from "@/logic/auth-utils";
import { OAuth2Client } from "google-auth-library";
import { redirect } from "next/navigation";
import { FC } from "react";

export interface ServerComponentWithOauth2ClientProps {
  oauth2Client: OAuth2Client;
}

const withAuthHOC = <T extends object>(
  Component: FC<T & ServerComponentWithOauth2ClientProps>
) => {
  return async function HOC(props: T) {
    const { oauth2Client, redirectTo } = await checkAndRefreshToken();

    if (redirectTo) {
      redirect(redirectTo);
      // return null; // Redirection has already been handled
    }

    if (!oauth2Client) {
      return null; // Ensure function stops if redirection is needed
    }

    return <Component {...props} oauth2Client={oauth2Client} />;
  };
};

export default withAuthHOC;
