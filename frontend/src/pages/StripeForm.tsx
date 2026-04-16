import { useState, type FormEvent } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useParams, useRouteLoaderData } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatUtils";
import type { MessageProps, Order } from "@/types";
import Message from "@/components/Message";
import { useTranslation } from "react-i18next";

const StripeFormPage = () => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const { id } = useParams();
  const data = useRouteLoaderData("order") as Order | MessageProps;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${
          import.meta.env.VITE_STRIPE_CONFIRMPAYMENT_URL
        }/order/${id}/stripe-payment-success`,
      },
    });

    if (result.error) {
      setErrorMessage(result.error.message ?? "An unknown error occurred");
    } else {
      setErrorMessage("An unexpected error occurred.");
    }
    setIsLoading(false);
  }
  let content;

  if ("message" in data) {
    content = <Message info>{data.message}</Message>;
  } else {
    content = (
      <form onSubmit={handleSubmit}>
        {errorMessage && <div className="text-destructive">{errorMessage}</div>}
        <PaymentElement className="mt-2" />
        <Button
          className="w-full mt-2"
          size="lg"
          disabled={!stripe || !elements || isLoading}
        >
          {isLoading
            ? t("stripe.purchasing")
            : `${t("stripe.purchase")} ${formatCurrency(data.totalPrice)}`}
        </Button>
      </form>
    );
  }

  return content;
};

export default StripeFormPage;
