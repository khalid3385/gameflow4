import {
  Link,
  Outlet,
} from "react-router";



const RootLayout = () => {
  return (
    <div className="min-h-dvh flex">
        <Header />

      {/* <div className="absolute p-6">
        <Link className="w-full h-full" to="/"></Link>
      </div> */}
      <main className="bg-neutral-100 w-full pt-13 flex">
      <Outlet />
      </main>
    </div>
  );
};



const Header = () => {
    return (
        <header className="h-13 fixed bg-white w-full border-b border-neutral-200">
            <div className="flex items-center h-full px-5" >
                <p className="tracking-widest  font-medium">gameflow</p>
            </div>
        </header>
    );
}




export default RootLayout;
