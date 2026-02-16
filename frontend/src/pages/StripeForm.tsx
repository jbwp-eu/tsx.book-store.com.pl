import { useState, type FormEvent } from "react";
import {
  // LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useParams, useRouteLoaderData } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatUtils";
import dictionary from "@/dictionaries/dictionary";
import { type ObjectDict } from "@/dictionaries/dictionary";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store";
import type { MessageProps, Order } from "@/types";
import Message from "@/components/Message";

const StripeFormPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { id } = useParams();
  const data = useRouteLoaderData("order") as Order | MessageProps;
  const { language } = useSelector((state: RootState) => state.ui);
  const { purchasing, purchasingPL, purchase, purchasePL } =
    dictionary.stripe as ObjectDict;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const [email, setEmail] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      // confirmParams: {
      //   return_url: `http://localhost:${
      //     import.meta.env.VITE_PORT
      //   }/order/${id}/stripe-payment-success`,
      // },
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
        {/* <div className="my-2">
        <LinkAuthenticationElement
          onChange={(e) => {
            setEmail(e.value.email);
          }}
        />
      </div> */}
        <Button
          className="w-full mt-2"
          size="lg"
          disabled={!stripe || !elements || isLoading}
        >
          {isLoading
            ? language === "en"
              ? purchasing
              : purchasingPL
            : language === "en"
            ? `${purchase} ${formatCurrency(data.totalPrice)}`
            : `${purchasePL} ${formatCurrency(data.totalPrice)}`}
        </Button>
      </form>
    );
  }

  return content;
};

export default StripeFormPage;
