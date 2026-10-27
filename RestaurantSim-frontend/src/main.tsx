import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import RootLayout from "./comps/root/RootLayout";
import JoinSession from "./comps/pages/JoinSession.tsx";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import CreateSession from "./comps/pages/CreateSession.tsx";
import Login from "./comps/pages/Login.tsx";
import SignUp from "./comps/pages/SignUp.tsx";
import Home from "./comps/pages/Home.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // element: <RootLayout />,
    children: [
      { path: "/", index: true, element: <Home />}, // landing page goes here
      { path: "/join", index: true, element: <JoinSession />}, // landing page goes here
      { path: "/login", index: true, element: <Login />}, // landing page goes here
      { path: "/signup", index: true, element: <SignUp />}, // landing page goes here
      { path: "/create", index: true, element: <CreateSession />}, // landing page goes here

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
