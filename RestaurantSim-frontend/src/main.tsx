import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import RootLayout from "./comps/root/RootLayout";
import JoinSession from "./comps/pages/JoinSession.tsx";
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // element: <RootLayout />,
    children: [
      { path: "/", index: true, element: <JoinSession />}, // landing page goes here

      { path: "*", element: <h1>page not found :(</h1> }, // not found
      { path: "foo", element: <App /> }, // not found
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </StrictMode>,
);
