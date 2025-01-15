import { GetServerSideProps } from "next";
import { FC } from "react";
import Link from "next/link";
import { ApiUrl, LoginStatus } from "@/types/enums";

interface IProps {
  status: LoginStatus;
}

const LoginPage: FC<IProps> = ({ status }) => {
  console.log(`status in LoginPage: ${status}`);

  switch (status) {
    case LoginStatus.LoginRequired:
      return (
        <div>
          <h1>Login to YouTube</h1>
          <Link href={ApiUrl.Login}>Login with Google</Link>
        </div>
      );

    case LoginStatus.LoginSuccess:
      return <p style={{ color: "green" }}>Login success</p>;

    case LoginStatus.LoginFailure:
      return <p style={{ color: "red" }}>Login failure</p>;

    default:
      return <p style={{ color: "red" }}>Unexpected status: {status}</p>;
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { status } = context.query;

  return {
    props: {
      status: status
        ? parseInt(status as string, 10)
        : LoginStatus.LoginRequired,
    },
  };
};

export default LoginPage;
