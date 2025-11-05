import { Sidebar } from "../components/Sidebar";
// import { Content } from "../components/Content"
import { Navigate, Outlet } from "react-router-dom";
import { DataProvider } from "../contexts/DataContext";
import { ResourcePageProvider } from "../contexts/ResourcePageContext";
import { ModalProvider } from "../contexts/ModalContext";
import { Modals } from "../components/ui/modal/Modal";
import AuthContext from "../contexts/AuthContext";
import { useContext } from "react";

export const MainLayout = () => {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />; // Render child routes (e.g., Login page) if not authenticated
  }

  return (
    <DataProvider>
      <ModalProvider>
        <ResourcePageProvider>
          <div className="min-h-screen bg-gray-100">
            <Sidebar />
            {/* <Content /> */}
            <div class="p-4 sm:ml-16 lg:ml-64">
              <div class="p-4 rounded-lg dark:border-gray-700">
                <Outlet />
              </div>
            </div>
          </div>
          <Modals />
        </ResourcePageProvider>
      </ModalProvider>
    </DataProvider>
  );
};
