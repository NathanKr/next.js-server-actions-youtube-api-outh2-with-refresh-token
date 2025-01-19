"use client";

import { clearSession } from "@/actions/gen-actions";
import { useState } from "react";

export default function DebugClearSession() {
  const [destroyed, setDestroyed] = useState<boolean | undefined>();

  const clickHandler = async () => {
    const _destroyed = await clearSession();
    setDestroyed(_destroyed);
  };

  let text = "";
  if (destroyed != undefined) {
    text = destroyed
      ? `Destroy success , 'Upload video' or 'Get number of videos' will navigate to login page`
      : "Destroy failure";
  }

  return (
    <>
      <h1>Page Debug Clear Session</h1>
      <button onClick={clickHandler}>clear session</button>
      <h2>{text}</h2>
    </>
  );
}
