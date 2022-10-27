import Topbar from "./Topbar";

const Layout = ({ children }) => {
  return (
    <div>
      <Topbar />
      <div className="flex min-h-screen w-full select-none justify-center bg-white pt-16 font-apple-text text-black">
        <div className="h-fit w-full max-w-4xl pt-4">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
