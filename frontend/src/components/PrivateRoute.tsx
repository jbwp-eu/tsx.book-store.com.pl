import { Outlet, useParams } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const { id } = useParams();

  const { userInfo } = useAppSelector((state) => state.auth);

  let user;

  if (window.location.pathname === `/order/${id}/stripe-payment-success`) {
    user = JSON.parse(localStorage.getItem("userInfo")!);
  } else {
    user = userInfo;
  }

  return user?.name && user?.email ? <Outlet /> : <Navigate to="/login" />;
  // return <Outlet />;
};

export default PrivateRoute;
