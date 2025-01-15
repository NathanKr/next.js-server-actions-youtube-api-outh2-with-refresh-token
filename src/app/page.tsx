import UserInfo from "@/components/user-info";
import { Pages } from "@/types/enums";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Your YouTube Videos</h1>
      <Link href={Pages.UploadVideo}>UploadVideo</Link>
      <br />
      <Link href={Pages.Videos}>Get number of videos</Link>
      <UserInfo />
      <Link href={Pages.Login}>Switch user</Link>
    </div>
  );
}
