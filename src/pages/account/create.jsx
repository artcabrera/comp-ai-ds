import { Listbox } from "@headlessui/react";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
const roles = ["Student", "Teacher"];
const Create = () => {
  const router = useRouter();

  {
    /** input */
  }
  const [role, setRole] = useState(roles[0]);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registering, setRegistering] = useState(false);

  {
    /** validation */
  }
  const [fError, setFError] = useState("");
  const [lError, setLerror] = useState("");
  const [uError, setUError] = useState("");
  const [eError, setEError] = useState("");
  const [pError, setPError] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [usernameValid, setUsernameValid] = useState(false);

  const validateEmail = () => {
    const validator = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    if (validator.test(email)) {
      checkEmailIfExists();
    }
    setEError("");
  };

  const checkEmailIfExists = async () => {
    const { data } = await axios.post(
      "/api/account/create/newNyanValidateEmail",
      { email }
    );
    if (data.valid) {
      setEError("");
      setEmailValid(true);
    } else {
      setEError("Email already exists.");
      setEmailValid(false);
    }
  };

  const validateUsername = async () => {
    const { data } = await axios.post(
      "/api/account/create/newNyanValidateUsername",
      { username }
    );
    if (data.valid) {
      setUError("");
      setUsernameValid(true);
    } else {
      setUError("Username already exists.");
      setUsernameValid(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    validateEmail();
    validateUsername();
    if (
      fError ||
      lError ||
      uError.includes("exists") ||
      eError.includes("exists") ||
      pError
    )
      return;
    if (!emailValid || !usernameValid) return;
    setRegistering(true);
    const { data } = await axios.post("/api/account/create/newNyan", {
      role,
      username,
      email,
      password,
      firstname,
      lastname,
    });
    if (data) setRegistering(false);
    router.push("/auth/signin");
  };

  return (
    <Fragment>
      <Head>
        <title>Create Your Account</title>
      </Head>
      <div className="flex h-fit w-full justify-center py-8">
        <div className="h-fit w-full max-w-md">
          <div className="text-center text-4xl font-bold">
            Create Your Account
          </div>
          <div className="mt-2 flex w-full justify-center text-center font-light">
            Already have an account?&nbsp;
            <Link href="/auth/signin">
              <a className="flex items-center text-blue-600 hover:underline">
                Sign in here
                <FiChevronRight className="h-4 w-4" />
              </a>
            </Link>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2 mt-8">
              <label className="text-sm font-medium text-gray-500">ROLE</label>
              <Listbox
                className="relative"
                as="div"
                value={role}
                onChange={setRole}
              >
                <Listbox.Button
                  as="button"
                  className="flex h-14 w-full items-center justify-between rounded border border-gray-200 px-4"
                >
                  <span>{role}</span>
                  <span>
                    <FiChevronDown className="h-5 w-5 text-gray-600" />
                  </span>
                </Listbox.Button>
                <Listbox.Options
                  as="div"
                  className="absolute top-14 z-10 w-full rounded border bg-white py-2 shadow-md"
                >
                  {roles.map((role, index) => (
                    <Listbox.Option
                      className={({ active, selected }) =>
                        `cursor-default select-none p-2 ${
                          active ? "bg-gray-100 text-black" : "text-gray-700"
                        } `
                      }
                      as="div"
                      key={index}
                      value={role}
                    >
                      {role}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>
            <div className="group relative col-span-1 h-14">
              <input
                required
                type="text"
                name="firstname"
                id="firstname"
                value={firstname}
                onChange={(event) => setFirstname(event.target.value)}
                className="peer h-full w-full rounded border border-gray-200 px-4 pt-6 focus:outline-none"
              />
              <label
                htmlFor="firstname"
                className="peer pointer-events-none absolute top-4 left-4 transform font-light text-gray-500 transition-all group-focus-within:-translate-y-2 group-focus-within:text-xs peer-valid:-translate-y-2 peer-valid:text-xs"
              >
                First name
              </label>
            </div>
            <div className="group relative col-span-1 h-14">
              <input
                required
                type="text"
                name="lastname"
                id="lastname"
                value={lastname}
                onChange={(event) => setLastname(event.target.value)}
                className="peer h-full w-full rounded border border-gray-200 px-4 pt-6 focus:outline-none"
              />
              <label
                htmlFor="lastname"
                className="peer pointer-events-none absolute top-4 left-4 transform font-light text-gray-500 transition-all group-focus-within:-translate-y-2 group-focus-within:text-xs peer-valid:-translate-y-2 peer-valid:text-xs"
              >
                Last name
              </label>
            </div>
            <div className="col-span-2 my-8 h-[1px] w-full bg-gray-200"></div>
            <div className="group relative col-span-2 h-14">
              <input
                required
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                className="peer h-full w-full rounded border border-gray-200 px-4 pt-6 focus:outline-none"
              />
              <label
                htmlFor="email"
                className="peer pointer-events-none absolute top-4 left-4 transform font-light text-gray-500 transition-all group-focus-within:-translate-y-2 group-focus-within:text-xs peer-valid:-translate-y-2 peer-valid:text-xs"
              >
                Email
              </label>
            </div>
            {!emailValid && (
              <div
                className={`-mt-2 text-xs ${
                  eError.includes("exists") ? "text-red-500" : "text-green-500"
                }`}
              >
                {eError}
              </div>
            )}
            <div className="col-span-2 box-border w-full cursor-help text-start text-sm tracking-tighter text-gray-500">
              Be sure to enter an email you can always access. It will be used
              to reset your password if you ever forget it.
            </div>
            <div className="group relative col-span-2 h-14">
              <input
                required
                type="text"
                name="username"
                id="username"
                autoComplete="off"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="peer h-full w-full rounded border border-gray-200 px-4 pt-6 focus:outline-none"
              />
              <label
                htmlFor="username"
                className="peer pointer-events-none absolute top-4 left-4 transform font-light text-gray-500 transition-all group-focus-within:-translate-y-2 group-focus-within:text-xs peer-valid:-translate-y-2 peer-valid:text-xs"
              >
                Username
              </label>
            </div>
            {!usernameValid && (
              <div
                className={`-mt-2 text-xs ${
                  uError.includes("exists") ? "text-red-500" : "text-green-500"
                }`}
              >
                {uError}
              </div>
            )}
            <div className="group relative col-span-2 h-14">
              <input
                required
                type="password"
                name="password"
                id="password"
                autoComplete="off"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="peer h-full w-full rounded border border-gray-200 px-4 pt-6 focus:outline-none"
              />
              <label
                htmlFor="password"
                className="peer pointer-events-none absolute top-4 left-4 transform font-light text-gray-500 transition-all group-focus-within:-translate-y-2 group-focus-within:text-xs peer-valid:-translate-y-2 peer-valid:text-xs"
              >
                Password
              </label>
            </div>
            <div className="group relative col-span-2 h-14">
              <input
                required
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                autoComplete="off"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="peer h-full w-full rounded border border-gray-200 px-4 pt-6 focus:outline-none"
              />
              <label
                htmlFor="confirmPassword"
                className="peer pointer-events-none absolute top-4 left-4 transform font-light text-gray-500 transition-all group-focus-within:-translate-y-2 group-focus-within:text-xs peer-valid:-translate-y-2 peer-valid:text-xs"
              >
                Confirm Password
              </label>
            </div>
            <div className="col-span-2 my-8 h-[1px] w-full bg-gray-200"></div>
            <div className="col-span-2">
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {registering ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};
export default Create;
