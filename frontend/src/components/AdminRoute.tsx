import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

const AdminRoute = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return userInfo?.isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
