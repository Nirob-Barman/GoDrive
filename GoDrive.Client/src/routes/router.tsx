import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../components/RootLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import CarListing from "../pages/public/CarListing";
import CarDetails from "../pages/public/CarDetails";
import NotFound from "../pages/public/NotFound";
import Dashboard from "../pages/user/Dashboard";
import AdminHome from "../pages/admin/AdminHome";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "cars", element: <CarListing /> },
      { path: "cars/:id", element: <CarDetails /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: "dashboard", element: <Dashboard /> }],
      },
      {
        element: <AdminRoute />,
        children: [{ path: "admin", element: <AdminHome /> }],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
