import {
  FaCube,
  FaCartShopping,
  FaUsers,
  FaChartColumn,
  FaTableColumns,
  FaArrowRightFromBracket,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
export const Sidebar = () => {
  return (
    <>
      <aside
        id="default-sidebar"
        className="fixed border-r-1 border-r-gray-200 top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <div className="p-2 my-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <h2 className="font-bold text-xl">Admin panel</h2>
            <p>Quản lý toàn bộ hệ thống</p>
          </div>

          <ul className="space-y-2 font-medium">
            <li>
              <SidebarButton label="Tổng quan" Icon={FaTableColumns} path=""/>
            </li>
            <li>
              <SidebarButton label="Sản phẩm" Icon={FaCube} path="products"/>
            </li>
            <li>
              <SidebarButton label="Đơn hàng" Icon={FaCartShopping} path="orders"/>
            </li>
            <li>
              <SidebarButton label="Khách hàng" Icon={FaUsers} path="users"/>
            </li>
            <li>
              <SidebarButton label="Phân tích AI" Icon={FaChartColumn} />
            </li>
          </ul>
          <div className="absolute bottom-4">
            <SidebarButton label="Đăng xuất" Icon={FaArrowRightFromBracket} />
          </div>
        </div>
      </aside>
    </>
  );
};

const SidebarButton = ({ Icon, label, path }) => {
  return (
    <Link to={`${path}`}
      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-green-700 hover:text-white dark:hover:bg-gray-700 group"
    >
      {Icon && <Icon className="size-5" />}
      <span className="ms-3">{label}</span>
    </Link>
  );
};
