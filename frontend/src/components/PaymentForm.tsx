import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hook.ts";
import { type RootState } from "@/store/store";
import { savePaymentMethod } from "@/store/cartSlice";
import { Button } from "./ui/button";
import dictionary from "@/dictionaries/dictionary";
import { type ObjectDict } from "@/dictionaries/dictionary";
import { useNavigate } from "react-router-dom";

const PaymentForm = () => {
  const { paymentMethod } = useAppSelector((state: RootState) => state.cart);
  const { language } = useAppSelector((state: RootState) => state.ui);

  const navigate = useNavigate();

  const {
    button_text,
    button_textPL,
    title,
    titlePL,
    description,
    descriptionPL,
    button_cancel,
    button_cancelPL,
  } = dictionary.paymentForm as ObjectDict;

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
      <h2 className="h2-semibold mt-4">
        {language === "en" ? title : titlePL}
      </h2>
      <p className="text-base font-light mt-2 ">
        {language === "en" ? description : descriptionPL}
      </p>
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
        <p className="flex my-4">
          <Input
            id="paypal"
            type="radio"
            name="paymentMethod"
            value="PayPal"
            checked={payment_Method === "PayPal"}
            onChange={handlePaymentChange}
            className="h-4 shadow-none w-10 "
            disabled
          />
          <Label htmlFor="paypal">PayPal</Label>
        </p>
        <div className="flex justify-end gap-x-4">
          <Button type="button" variant="outline" onClick={cancelHandler}>
            {language === "en" ? button_cancel : button_cancelPL}
          </Button>
          <Button type="submit">
            {language === "en" ? button_text : button_textPL}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
