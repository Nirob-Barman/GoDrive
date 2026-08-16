import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "../components/RootLayout";
import AdminLayout from "../components/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import ForgotPassword from "../pages/public/ForgotPassword";
import ResetPassword from "../pages/public/ResetPassword";
import CarListing from "../pages/public/CarListing";
import CarDetails from "../pages/public/CarDetails";
import NotFound from "../pages/public/NotFound";
import Dashboard from "../pages/user/Dashboard";
import Profile from "../pages/user/Profile";
import BookCar from "../pages/user/BookCar";
import MyReservations from "../pages/user/MyReservations";
import PaymentReturn from "../pages/user/PaymentReturn";
import PaymentCancelled from "../pages/user/PaymentCancelled";
import ManageReservations from "../pages/admin/ManageReservations";
import ManageCars from "../pages/admin/ManageCars";
import CarForm from "../pages/admin/CarForm";
import ManageUsers from "../pages/admin/ManageUsers";
import AdminDashboard from "../pages/admin/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "cars", element: <CarListing /> },
      { path: "cars/:id", element: <CarDetails /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "profile", element: <Profile /> },
          { path: "book/:carId", element: <BookCar /> },
          { path: "reservations", element: <MyReservations /> },
          { path: "payment/return", element: <PaymentReturn /> },
          { path: "payment/cancelled", element: <PaymentCancelled /> },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: "admin",
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="/admin/dashboard" replace /> },
              { path: "dashboard", element: <AdminDashboard /> },
              { path: "reservations", element: <ManageReservations /> },
              { path: "cars", element: <ManageCars /> },
              { path: "cars/new", element: <CarForm /> },
              { path: "cars/:id/edit", element: <CarForm /> },
              { path: "users", element: <ManageUsers /> },
            ],
          },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
