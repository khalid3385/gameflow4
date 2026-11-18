import RootHeader from "./RootHeader"
import { AppRoute } from "./AppRoute";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="min-h-dvh flex bg-page">
      <RootHeader />
      <main className="max-h-screen- text-main-text w-full pt-15 flex">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
