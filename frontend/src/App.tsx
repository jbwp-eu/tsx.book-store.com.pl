import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/Root";
import HomePage from "./pages/Home";
import Fallback from "./components/Fallback";
import ProductDetailPage from "./pages/ProductDetail";
import ErrorPage from "./pages/Error";
import ThemeProvider from "./components/ThemeProvider";
import CartPage from "./pages/Cart";
import PrivateRoute from "./components/PrivateRoute";
import ShippingPage from "./pages/Shipping";
import AuthenticationPage from "./pages/Authentication";
import RegisterPage from "./pages/Register";
import { useAppDispatch, useAppSelector } from "./store/hook";
import { type RootState } from "./store/store";
import PaymentPage from "./pages/Payment";
import PlaceOrder from "./pages/PlaceOrder";
import OrderPage from "./pages/Order";
import StripeSuccessPage from "./pages/StripeSuccess";
import StripeFormPage from "./pages/StripeForm";
import ProfilePage from "./pages/Profile";
import OrdersPage from "./pages/Orders";
import AdminRoute from "./components/AdminRoute";
import OrdersListPage from "./pages/admin/OrdersList";
import ProductsListPage from "./pages/admin/ProductsList";
import UsersListPage from "./pages/admin/UsersList";
import UserEditPage from "./pages/admin/UserEdit";
import ProductEditPage from "./pages/admin/ProductEdit";
import { tokenLoader } from "./utils/tokenUtils.ts";
import ReviewsPage from "./pages/Reviews.tsx";
import ReviewsListPage from "./pages/admin/ReviewsList.tsx";
import OverviewPage from "./pages/admin/Overview.tsx";

import ProductCarousel from "./components/ProductCarousel.tsx";
import Footer from "./components/Footer.tsx";
import StoreRegulationsPage from "./pages/StoreRegulations.tsx";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import i18n from "@/i18n/i18n";

function App() {
  const { language } = useAppSelector((state: RootState) => state.ui);
  const dispatch = useAppDispatch();

  useEffect(() => {
    void i18n.changeLanguage(language === "pl" ? "pl" : "en");
  }, [language]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      loader: tokenLoader,
      action: Footer.action(language),
      hydrateFallbackElement: <Fallback asOverlay />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <HomePage />,
          loader: HomePage.loader(language),
          hydrateFallbackElement: <Fallback asOverlay />,
          children: [
            {
              path: "",
              element: <ProductCarousel />,
              loader: ProductCarousel.loader(language),
            },
          ],
        },
        {
          path: "/page/:pageNumber",
          element: <HomePage />,
          loader: HomePage.loader(language),
          hydrateFallbackElement: <Fallback asOverlay />,
          children: [
            {
              path: "",
              element: <ProductCarousel />,
              loader: ProductCarousel.loader(language),
            },
          ],
        },
        {
          path: "/product/:id",
          element: <ProductDetailPage />,
          loader: ProductDetailPage.loader(language),
          action: ProductDetailPage.action(language),
          hydrateFallbackElement: <Fallback asOverlay />,
        },
        {
          path: "/cart",
          element: <CartPage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
          action: AuthenticationPage.action(dispatch, language),
        },
        {
          path: "/login",
          element: <AuthenticationPage />,
          action: AuthenticationPage.action(dispatch, language),
        },
        {
          path: "/regulations",
          element: <StoreRegulationsPage />,
        },
        {
          path: "",
          element: <PrivateRoute />,
          children: [
            {
              path: "shipping",
              element: <ShippingPage />,
            },
            {
              path: "payment",
              element: <PaymentPage />,
            },
            {
              path: "placeorder",
              element: <PlaceOrder />,
              action: PlaceOrder.action(dispatch, language),
            },
            {
              path: "order/:id",
              id: "order",
              element: <OrderPage />,
              hydrateFallbackElement: <Fallback asOverlay />,
              loader: OrderPage.loader(language),
              action: OrderPage.action(language),
              children: [
                { path: "checkout", element: <StripeFormPage /> },
                {
                  path: "stripe-payment-success",
                  element: <StripeSuccessPage />,
                },
              ],
            },
            {
              path: "profile",
              element: <ProfilePage />,
              hydrateFallbackElement: <Fallback asOverlay />,
              action: ProfilePage.action(language, dispatch),
            },
            {
              path: "orders",
              element: <OrdersPage />,
              hydrateFallbackElement: <Fallback asOverlay />,
              loader: OrdersPage.loader(language),
            },
            {
              path: "reviews",
              element: <ReviewsPage />,
              loader: ReviewsPage.loader(language),
              action: ReviewsPage.action(language),
              hydrateFallbackElement: <Fallback asOverlay />,
            },
          ],
        },
        {
          path: "",
          element: <AdminRoute />,
          children: [
            {
              path: "admin/overview",
              element: <OverviewPage />,
              loader: OverviewPage.loader(language),
            },
            {
              path: "admin/ordersList",
              element: <OrdersListPage />,
              hydrateFallbackElement: <Fallback asOverlay />,
              loader: OrdersListPage.loader(language),
              action: OrdersListPage.action(language),
            },
            {
              path: "admin/ordersList/page/:pageNumber",
              element: <OrdersListPage />,
              hydrateFallbackElement: <Fallback asOverlay />,
              loader: OrdersListPage.loader(language),
              action: OrdersListPage.action(language),
            },
            {
              path: "admin/productsList",
              element: <ProductsListPage />,
              hydrateFallbackElement: <Fallback asOverlay />,
              loader: ProductsListPage.loader(language),
              action: ProductsListPage.action(language),
            },
            {
              path: "admin/productsList/page/:pageNumber",
              element: <ProductsListPage />,
              hydrateFallbackElement: <Fallback asOverlay />,
              loader: ProductsListPage.loader(language),
              action: ProductsListPage.action(language),
            },
            {
              path: "admin/product/:id/edit",
              element: <ProductEditPage />,
              hydrateFallbackElement: <Fallback asOverlay />,
              loader: ProductEditPage.loader(language),
              action: ProductEditPage.action(language),
            },
            {
              path: "admin/usersList",
              element: <UsersListPage />,
              hydrateFallbackElement: <Fallback asOverlay />,
              loader: UsersListPage.loader(language),
              action: UsersListPage.action(language),
            },
            {
              path: "admin/user/:id/edit",
              element: <UserEditPage />,
              hydrateFallbackElement: <Fallback asOverlay />,
              loader: UserEditPage.loader(language),
              action: UserEditPage.action(language),
            },
            {
              path: "admin/reviewsList",
              element: <ReviewsListPage />,
              hydrateFallbackElement: <Fallback asOverlay />,
              loader: ReviewsListPage.loader(language),
              action: ReviewsListPage.action(language),
            },
            {
              path: "admin/reviewsList/page/:pageNumber",
              element: <ReviewsListPage />,
              hydrateFallbackElement: <Fallback asOverlay />,
              loader: ReviewsListPage.loader(language),
              action: ReviewsListPage.action(language),
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ]);

  return (
    <ThemeProvider defaultTheme="system">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
