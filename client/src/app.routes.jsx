import { createBrowserRouter, Navigate } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import CreateInterview from "./features/interview/pages/CreateInterview";
import Interview from "./features/interview/pages/Interview";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/home",
    element: <Protected><Home /></Protected>
  },
  {
    path: "/interview/new",
    element: <Protected><CreateInterview /></Protected>
  },
  {
    path: "/interview/:interviewId",
    element: <Protected><Interview /></Protected>
  }
]);