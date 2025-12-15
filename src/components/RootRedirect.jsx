import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

export const RootRedirect = () => {
  const { isAuthenticated } = useContext(AuthContext);

  // Nếu đã đăng nhập, chuyển đến dashboard
  // Nếu chưa đăng nhập, chuyển đến trang login
  return <Navigate to={isAuthenticated ? "/dashboard" : "/auth/login"} replace />;
};
