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

import { AuthProvider } from "./auth/AuthContext";
import Login from "./comps/pages/Login.tsx";
import SignUp from "./comps/pages/SignUp.tsx";
import Home from "./comps/pages/Home.tsx";
import PageNotFound from "./comps/pages/PageNotFound.tsx";
import TeamRolesPage from "./comps/pages/TeamRolesPage";
import CreateSession from "./comps/pages/createSession/CreateSession.tsx";
import { AppRoute } from "./comps/root/AppRoute.tsx";

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
    children: [
      // Openbare pagina's (voor iedereen zichtbaar)
      { index: true, element: <Home /> },
      { path: "join", element: <JoinSession /> },
      {
        path: "preview/roles",
        element: (
          <div className="m-10 w-full">
            <TeamRolesPage teamName="Preview Team" memberCount={6} />
          </div>
        ),
      },

      // Alleen voor uitgelogde gebruikers (stuurt al ingelogde gebruikers weg naar "/")
      {
        element: <AppRoute protectedRoute={false} />,
        children: [
          { path: "login", element: <Login /> },
          { path: "signup", element: <SignUp /> },
        ],
      },

      // Alleen voor ingelogde gebruikers (stuurt gasten door naar "/login")
      {
        element: <AppRoute protectedRoute={true} />,
        children: [
          {
            path: "create",
            element: <CreateSession />,
            hydrateFallbackElement: (
              <p className="m-10" role="status">
                Checking your login...
              </p>
            ),
            errorElement: (
              <p className="m-10" role="alert">
                Could not verify your login. Refresh the page to try again.
              </p>
            ),
          },
        ],
      },

      { path: "*", element: <PageNotFound /> },
    ],
  },
]);


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <App /> */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
