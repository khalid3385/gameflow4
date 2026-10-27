import { Link, Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="min-h-dvh flex">
      <Header />
      <main className="bg-neutral-100- w-full pt-15 flex">
        <Outlet />
      </main>
    </div>
  );
};

const Header = () => {
  return (
    <header className="h-15 fixed bg-white w-full border-b border-neutral-300">
      <div className="flex items-center justify-between h-full px-5">
        <p className="tracking-widest text-lg font-medium">potatoes</p>
        <div className="flex gap-5">
          {["create", "join", "login", "signUp"].map((a) => (
            <>
              <Link to={`/${a}`}>
                <p>{a}</p>
              </Link>
            </>
          ))}
        </div>
      </div>
    </header>
  );
};

export default RootLayout;
