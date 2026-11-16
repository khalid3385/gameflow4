import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RootLayout from "./comps/root/RootLayout.tsx";
import JoinSession from "./comps/pages/JoinSession.tsx";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  type LoaderFunctionArgs,
} from "react-router";

import Login from "./comps/pages/Login.tsx";
import SignUp from "./comps/pages/SignUp.tsx";
import Home from "./comps/pages/Home.tsx";
import PageNotFound from "./comps/pages/PageNotFound.tsx";
import TeamRolesPage from "./comps/pages/TeamRolesPage";
import CreateSession from "./comps/pages/createSession/CreateSession.tsx";

async function requireLogin({ request }: LoaderFunctionArgs) {
  const response = await fetch("/auth/manage/info", {
    credentials: "include",
    cache: "no-store",
    signal: request.signal,
  });

  if (response.status === 401) return redirect("/login?reason=create");

  const contentType = response.headers.get("content-type");

  if (!response.ok || !contentType?.includes("application/json")) {
    throw new Error("Could not verify your login.");
  }

  return null;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // element: <RootLayout />,
    children: [
      { path: "/", index: true, element: <Home /> }, // landing page goes here
      { path: "/join", index: true, element: <JoinSession /> }, // landing page goes here
      { path: "/login", index: true, element: <Login /> }, // landing page goes here
      { path: "/signup", index: true, element: <SignUp /> }, // landing page goes here
      {
        path: "preview/roles",
        element: (
          <div className="m-10 w-full">
            <TeamRolesPage teamName="Preview Team" memberCount={6} />
          </div>
        ),
      },
      {
        path: "/create",
        loader: requireLogin,
        element: <CreateSession />,
        hydrateFallbackElement: (
          <p className="m-10" role="status">
            {" "}
            Checking your login...
          </p>
        ),
        errorElement: (
          <p className="m-10" role="alert">
            Could not verify your login. Refresh the page to try again.
          </p>
        ),
      }, // landing page goes here

      { path: "*", element: <PageNotFound /> }, // not found
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </StrictMode>,
);
