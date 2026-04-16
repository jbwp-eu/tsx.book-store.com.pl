import StripePayment from "@/pages/StripePayment";
import { useEffect, useState } from "react";
import Fallback from "@/components/Fallback";
import { formatCurrency } from "@/utils/formatUtils";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hook";
import { useSubmit } from "react-router-dom";
import type { Order } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const OrderSummary = ({ order }: { order: Order }) => {
  const { t } = useTranslation();
  const currency = import.meta.env.VITE_CURRENCY;
  const { userInfo } = useAppSelector((state) => state.auth);
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
            <p>{t("order.items")}</p>
            <p>{formatCurrency(itemsPrice)}</p>
          </div>
          <div className="flex justify-between">
            <p>{t("order.tax")}</p>
            <p>{formatCurrency(taxPrice)}</p>
          </div>
          <div className="flex justify-between">
            <p>{t("order.shipping")}</p>
            <p>{formatCurrency(shippingPrice)}</p>
          </div>
          <div className="flex justify-between font-bold">
            <p className="">{t("order.total")}</p>
            <p className="">{formatCurrency(totalPrice)}</p>
            {}
          </div>
          {(!isDelivered || !deliveredAt) && userInfo.isAdmin && (
            <Button className="w-full" onClick={deliverOrderHandler}>
              {t("order.markAsDelivered")}
            </Button>
          )}

          {!isPaid && paymentMethod === "Stripe" && (
            <div>
              {loading ? (
                <Fallback asOverlay={false} />
              ) : (
                <StripePayment clientSecret={clientSecret} />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummary;
