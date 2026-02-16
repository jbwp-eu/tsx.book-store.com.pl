import { Outlet } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Loader } from "lucide-react";

// import ThemeProvider from "@/components/ThemeProvider";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_TEST_MODE
);
// const loader = "auto";

const StripePayment = ({ clientSecret }: { clientSecret: string }) => {
  // const { theme } = ThemeProvider.useTheme();
  const options = {
    clientSecret,
    // appearance: {
    //   theme: "stripe",
    // },
    // loader,
  };

  return (
    <div>
      {!clientSecret ? (
        <Loader />
      ) : (
        <Elements stripe={stripePromise} options={options}>
          <Outlet />
        </Elements>
      )}
    </div>
  );
};

export default StripePayment;
