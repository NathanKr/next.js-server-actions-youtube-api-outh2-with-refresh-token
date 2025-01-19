"use server"

import { cookies } from "next/headers";
import { getIronSessionByCookiesDefaultMaxAge } from "@/logic/iron-session-utils";

export async function clearSession(): Promise<boolean> {
  let destroyed: boolean;
  try {
    const cookieHeaders = cookies();
    const session = await getIronSessionByCookiesDefaultMaxAge(cookieHeaders);
    session.destroy(); // -- this is same as logout in iron-session-utils
    destroyed = true;
  } catch (err) {
    console.error(err);
    destroyed = false;
  }

  return destroyed;
}
