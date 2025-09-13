import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { useContext } from "react";

export const AuthLayout = () => {
  const { isAuthenticated } = useContext(AuthContext);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <section class="bg-white dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <h2 class="flex items-center mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          Admin Panel
        </h2>
        <Outlet />
      </div>
    </section>
  );
};
