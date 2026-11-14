import { Link } from "react-router";
import Button from "../util/Button";

const RootHeader = () => {
  return (
    <header className="h-15 fixed w-full bg-page border-b border-context-border">
      <div className="flex items-center justify-between gap-10 h-full px-5">
        <Link to={"/"}>
          <h1 className="tracking-widest- text-xl font-[600] font-serif=">RestauFlow</h1>
        </Link>

        <nav className="flex justify-between items-center  h-full flex-1 gap-5">
          <section className="gap-6 flex h-full items-center ">
            <NavLink to={"/create"}>{"Create"}</NavLink>
            <NavLink to={"/join"}>{"Join"}</NavLink>
          </section>

          <section className="gap-5 flex h-full items-center">
            <NavLink to={"/login"}>{"Login"}</NavLink>
            <NavLink to={"/signUp"}>
              <Button className="bg-primary rounded-4xl! py-2! px-3 hover:bg-primary-hover">
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
    <Link className="text-sm  font-[450]" to={to}>
      {children}
    </Link>
  );
};

export default RootHeader;
