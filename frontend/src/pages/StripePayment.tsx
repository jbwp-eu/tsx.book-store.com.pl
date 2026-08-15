import { Outlet } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Loader } from "lucide-react";
import { env } from "@/lib/env";

const stripePromise = loadStripe(env.stripePublishableKey || "");

const StripePayment = ({ clientSecret }: { clientSecret: string }) => {
  const options = {
    clientSecret,
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
