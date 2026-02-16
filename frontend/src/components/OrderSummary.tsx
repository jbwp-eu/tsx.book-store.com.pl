import StripePayment from "@/pages/StripePayment";
import { useEffect, useState } from "react";
import Fallback from "@/components/Fallback";
import PayPalPayment from "@/pages/PayPalPayment";
import { formatCurrency } from "@/utils/formatUtils";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hook";
import { type RootState } from "@/store/store";
import dictionary, { type ObjectDict } from "@/dictionaries/dictionary";
import { useSubmit } from "react-router-dom";
import type { Order } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

const OrderSummary = ({ order }: { order: Order }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { language } = useAppSelector((state: RootState) => state.ui);
  const { userInfo } = useAppSelector((state: RootState) => state.auth);
  const [loading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const {
    id,
    paymentMethod,
    isPaid,
    isDelivered,
    deliveredAt,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = order;

  const {
    items,
    itemsPL,
    shipping,
    shippingPL,
    total,
    totalPL,
    tax,
    taxPL,
    markAsDelivered,
    markAsDeliveredPL,
  } = dictionary.order as ObjectDict;

  const submit = useSubmit();

  const deliverOrderHandler = () => {
    submit(null, { method: "put" });
  };

  useEffect(() => {
    async function getClientSecret() {
      try {
        const amount = Math.round(Number(totalPrice) * 100);
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/create-payment-intent`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id,
              amount,
              currency,
            }),
          }
        );
        if (!response.ok) {
          const responseData = await response.json();
          throw new Error(responseData.message);
        }
        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
        setIsLoading(false);
      } catch (err) {
        console.log("err stripe:", err);
      }
    }
    if (paymentMethod === "Stripe" && !isPaid) {
      getClientSecret();
    }
  }, [id, currency, totalPrice, isPaid, paymentMethod]);

  return (
    <div className="mt-4 md:mt-0">
      <Card>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <p>{language === "en" ? items : itemsPL}</p>
            <p>{formatCurrency(itemsPrice)}</p>
          </div>
          <div className="flex justify-between">
            <p>{language === "en" ? tax : taxPL}</p>
            <p>{formatCurrency(taxPrice)}</p>
          </div>
          <div className="flex justify-between">
            <p>{language === "en" ? shipping : shippingPL}</p>
            <p>{formatCurrency(shippingPrice)}</p>
          </div>
          <div className="flex justify-between font-bold">
            <p className="">{language === "en" ? total : totalPL}</p>
            <p className="">{formatCurrency(totalPrice)}</p>
            {}
          </div>
          {(!isDelivered || !deliveredAt) && userInfo.isAdmin && (
            <Button className="w-full" onClick={deliverOrderHandler}>
              {language === "en" ? markAsDelivered : markAsDeliveredPL}
            </Button>
          )}

          {/* Stripe payment */}
          {!isPaid && paymentMethod === "Stripe" && (
            <div>
              {loading ? (
                <Fallback asOverlay={false} />
              ) : (
                <StripePayment clientSecret={clientSecret} />
              )}
            </div>
          )}

          {/* PayPal payment */}
          {!isPaid && paymentMethod === "PayPal" && <PayPalPayment />}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummary;
