import Container from "../components/Container";
import DemoNoticeBanner from "../components/DemoNoticeBanner";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet, useLoaderData, useNavigation } from "react-router-dom";
import Fallback from "../components/Fallback";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hook";
import { logout } from "@/store/authSlice";
import { getTokenDuration } from "@/utils/tokenUtils";

const RootLayout = () => {
  const navigation = useNavigation();
  const token = useLoaderData();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) {
      return;
    }
    if (token === "EXPIRED") {
      dispatch(logout());
    }
    const tokenDuration = getTokenDuration();
    setTimeout(() => {
      dispatch(logout());
    }, tokenDuration);
  }, [token, dispatch]);

  return (
    <div className={cn("flex flex-col")}>
      <Toaster richColors expand position="bottom-right" />
      <Header />
      <DemoNoticeBanner />
      <main className="min-h-screen">
        <Container>
          {navigation.state === "loading" ? <Fallback asOverlay /> : <Outlet />}
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
