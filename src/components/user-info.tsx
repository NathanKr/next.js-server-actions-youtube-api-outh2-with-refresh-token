"use client"

import { FC, useEffect, useState } from "react";
import axios from "axios";
import { ApiUrl } from "@/types/enums";
import { ErrorResponse } from "@/types/api";
import { TUserInfo } from "@/types/types";
import Image from "next/image";

const UserInfo: FC = () => {
  const [userInfo, setUserInfo] = useState<TUserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get<TUserInfo>(ApiUrl.UserInfo); // Call your API endpoint
        setUserInfo(response.data); // Set user info state with the response data
      } catch (err) {
        const axiosError = err as ErrorResponse; // Cast the error to your defined type
        setError(
          axiosError?.error || "An error occurred while fetching user info"
        );
      }
    };

    fetchUserInfo(); // Fetch user info on component mount
  }, []);

  if (error) {
    return <p>Error: {error}</p>; // Show error message if the request fails
  }

  
  return (
    <div>
      {userInfo ? (
        <div>
          <h3>Authenticated User Info</h3>
          <p>Email: {userInfo.email}</p>
          <p>Name: {userInfo.name}</p>
          <p>Given Name: {userInfo.given_name}</p>
          <p>Family Name: {userInfo.family_name}</p>
          <p>
            Picture: <Image width="96" height="96" src={userInfo.picture ?? ""} alt="User profile" />
          </p>
          <p>Locale: {userInfo.locale}</p>
          <p>HD: {userInfo.hd}</p>
        </div>
      ) : (
        <p>Loading...</p> // Show loading message while fetching data
      )}
    </div>
  );
};

export default UserInfo;
