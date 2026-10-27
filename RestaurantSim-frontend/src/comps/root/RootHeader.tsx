import { Link } from "react-router";
import Button from "../util/Button";

const RootHeader = () => {
  return (
    <header className="h-15 fixed bg-white w-full border-b- border-neutral-300">
      <div className="flex items-center justify-between gap-8 h-full px-10">
        <Link to={"/"}>
          <h1 className="tracking-widest text-xl font-medium">potatoes</h1>
        </Link>

        <nav className="flex justify-between items-center  h-full flex-1 gap-5">
          <section className="gap-6 flex h-full items-center ">
            <NavLink to={"/create"}>{"Create"}</NavLink>
            <NavLink to={"/join"}>{"Join"}</NavLink>
          </section>

          <section className="gap-5 flex h-full items-center">
            <NavLink to={"/login"}>{"Login"}</NavLink>
            <NavLink to={"/signUp"}>
              <Button className="bg-neutral-800 hover:bg-neutral-700">
                <p className="text-white ">Try for free</p>
              </Button>
            </NavLink>
          </section>
        </nav>
      </div>
    </header>
  );
};

const NavLink = ({
  children,
  to,
}: {
  children: React.ReactNode;
  to: string;
}) => {
  return (
    <Link className="text-sm  font-medium0" to={to}>
      {children}
    </Link>
  );
};

export default RootHeader;
