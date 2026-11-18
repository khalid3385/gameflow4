import { Link } from "react-router";
import Button from "../util/Button";
import { useAuth } from "../../auth/AuthContext";

const RootHeader = () => {
  const { isLoggedIn, loading, logout } = useAuth();

  return (
    <header className="h-15 fixed w-full bg-page border-b border-context-border">
      <div className="flex items-center justify-between gap-10 h-full px-5">
        <Link to="/">
          <h1 className="text-xl font-[600]">RestauFlow</h1>
        </Link>

        <nav className="flex justify-between items-center h-full flex-1 gap-5">
          <section className="gap-6 flex h-full items-center">
            {!loading && isLoggedIn && <NavLink to="/create">Create</NavLink>}
            <NavLink to="/join">Join</NavLink>
          </section>

          {!loading && (
            <UserSection isLoggedIn={isLoggedIn} onLogout={logout} />
          )}
        </nav>
      </div>
    </header>
  );
};

const UserSection = ({
  isLoggedIn,
  onLogout,
}: {
  isLoggedIn: boolean;
  onLogout: () => void;
}) => {
  return (
    <section className="gap-5 flex h-full items-center">
      {isLoggedIn ? (
        <Button
          onClick={onLogout}
          className="bg-primary rounded-4xl! py-2! px-3 hover:bg-primary-hover text-sm text-white"
        >
          Sign Out
        </Button>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/signup">
            <Button className="bg-primary rounded-4xl! py-2! px-3 hover:bg-primary-hover text-white">
              Try for free
            </Button>
          </NavLink>
        </>
      )}
    </section>
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
    <Link className="text-sm! font-[450]" to={to}>
      {children}
    </Link>
  );
};

export default RootHeader;
