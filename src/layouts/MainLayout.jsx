import { Sidebar } from "../components/Sidebar";
// import { Content } from "../components/Content"
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ModalProvider } from "../contexts/ModalContext";
import Modal from "../components/ui/modal/Modal";
import AuthContext from "../contexts/AuthContext";
import { useContext } from "react";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export const MainLayout = () => {
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />; // Render child routes (e.g., Login page) if not authenticated
  }

  return (
    // <DataProvider>
      <ModalProvider>
        {/* <ResourcePageProvider> */}
          <div className="min-h-screen bg-gray-100">
            <Sidebar />
            {/* <Content /> */}
            <div class="p-4 sm:ml-16 lg:ml-64">
              <div class="p-4 rounded-lg dark:border-gray-700">
                <Outlet />
              </div>
            </div>
          </div>
          <Modal />
      </ModalProvider>
  );
};
