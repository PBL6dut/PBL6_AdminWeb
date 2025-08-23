import { Sidebar } from "../components/Sidebar";
// import { Content } from "../components/Content"
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <div>
      <Sidebar />
      <div class="p-4 sm:ml-16 lg:ml-64">
        <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <Outlet />
        </div>
      </div>
    </div>
  );
};
