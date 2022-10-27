import Head from "next/head";
import { Fragment, useState } from "react";
import Link from "next/link";
import { FiArrowUpRight, FiLock } from "react-icons/fi";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = async (event) => {
    event.preventDefault();
    await signIn("credentials", { username, password });
  };

  const { query } = useRouter();

  const SigninError = () => {
    const error = query.error;
    if (error)
      return (
        <div className="h-fit w-full pt-2 text-center text-xs text-red-500">
          Username or password is incorrect
        </div>
      );
  };

  return (
    <Fragment>
      <Head>
        <title>Sign In</title>
      </Head>
      <div className="-mt-16 flex h-screen w-full items-center justify-center">
        <div className="h-fit w-full max-w-xs">
          <h1 className="w-full text-center font-apple-display text-2xl font-semibold">
            Sign in
          </h1>
          <SigninError />
          <form
            onSubmit={handleSignin}
            className="text mt-4 h-fit w-full font-light"
          >
            <div className="-space-y-px rounded-md">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Username or Email"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Password"
                />
              </div>
            </div>
            <div className="flex items-center justify-center py-4">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:border-blue-500 focus:ring-transparent focus:ring-offset-4 focus:ring-offset-blue-100"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block cursor-pointer text-gray-700"
              >
                Remember me
              </label>
            </div>
            <div>
              <button
                type="submit"
                disabled={username === "" || password === ""}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <FiLock
                    className="h-4 w-4 text-blue-500 group-hover:text-blue-400"
                    aria-hidden="true"
                  />
                </span>
                Sign in
              </button>
            </div>
          </form>
          <div className="h-fit w-full px-8 py-4">
            <div className="h-[1px] w-full bg-gradient-to-r from-white via-gray-200 to-white"></div>
          </div>
          <div className="h-fit w-full space-y-2">
            <div className="flex h-fit w-full justify-center">
              <Link href="/account/password/recover">
                <a className="flex items-end text-sm font-light text-blue-600 hover:underline">
                  Forgot password?
                  <FiArrowUpRight className="h-4 w-4" />
                </a>
              </Link>
            </div>
            <div className="flex h-fit w-full justify-center text-sm font-light">
              Don&apos;t have an account?&nbsp;
              <Link href="/account/create">
                <a className="flex items-end text-blue-600 hover:underline">
                  Create now.
                  <FiArrowUpRight className="h-4 w-4" />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Login;

export const getServerSideProps = async (context) => {
  const { req } = context;
  const session = await getSession({ req });

  if (session && session.role) {
    return {
      redirect: {
        permanent: true,
        destination: "/user/" + session.role.toLowerCase(),
      },
    };
  }
  return {
    props: {},
  };
};
