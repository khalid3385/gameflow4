import { Link, Outlet } from "react-router";

import RootHeader from "./RootHeader"

const RootLayout = () => {
  return (
    <div className="min-h-dvh flex">
      <RootHeader />
      <main className="bg-neutral-100- w-full pt-15 flex">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
