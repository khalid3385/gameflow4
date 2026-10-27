import { Link, Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="min-h-dvh flex">
      <Header />

      {/* <div className="absolute p-6">
        <Link className="w-full h-full" to="/"></Link>
      </div> */}
      <main className="bg-neutral-100- w-full pt-13 flex">
        <Outlet />
      </main>
    </div>
  );
};

const Header = () => {
  return (
    <header className="h-13 fixed bg-white w-full border-b border-neutral-300">
      <div className="flex items-center justify-between h-full px-5">
        <p className="tracking-widest  font-medium">gameflow</p>
        <div className="flex gap-5">
          {["create", "join"].map(a => 
            <>
            
            <Link to={`/${a}`}>
              <p>{a}</p>
            </Link>

            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default RootLayout;
