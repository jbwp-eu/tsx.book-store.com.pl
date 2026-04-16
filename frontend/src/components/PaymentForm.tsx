import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hook.ts";
import { type RootState } from "@/store/store";
import { savePaymentMethod } from "@/store/cartSlice";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PaymentForm = () => {
  const { t } = useTranslation();
  const { paymentMethod } = useAppSelector((state: RootState) => state.cart);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [payment_Method, setPaymentMethod] = useState(paymentMethod);

  function handlePaymentChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPaymentMethod(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(savePaymentMethod(payment_Method));
    navigate("/placeorder");
  }

  function cancelHandler() {
    navigate("..");
  }

  return (
    <div>
      <h2 className="h2-semibold mt-4">{t("paymentForm.title")}</h2>
      <p className="text-base font-light mt-2 ">{t("paymentForm.description")}</p>
      <form onSubmit={handleSubmit}>
        <p className="flex my-4 ">
          <Input
            id="stripe"
            type="radio"
            name="paymentMethod"
            value="Stripe"
            checked={payment_Method === "Stripe"}
            onChange={handlePaymentChange}
            className="h-4 w-10 shadow-none "
          />
          <Label htmlFor="stripe">Stripe</Label>
        </p>
        <div className="flex justify-end gap-x-4">
          <Button type="button" variant="outline" onClick={cancelHandler}>
            {t("paymentForm.button_cancel")}
          </Button>
          <Button type="submit">{t("paymentForm.button_text")}</Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
