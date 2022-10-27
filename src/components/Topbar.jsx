import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Topbar = () => {
  const { data: session } = useSession();
  return (
    <div className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-center border-b bg-white font-bold backdrop-blur">
      <div className="flex h-full w-full max-w-4xl items-center justify-between">
        <div className="flex space-x-2">
          <div className="relative h-12 w-12">
            <Image
              src="/assets/capsu-logo.png"
              alt="capsu-logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="flex h-full w-fit flex-col items-start justify-center">
            <h3>Computer Aided Instruction for Distributed System</h3>
            <h3 className="text-xs font-normal">
              CAPSU Mambusao Satellite College
            </h3>
          </div>
        </div>
        {session && (
          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="text-md h-fit rounded border bg-white px-4 py-1 font-normal"
          >
            Signout
          </button>
        )}
      </div>
    </div>
  );
};

export default Topbar;
