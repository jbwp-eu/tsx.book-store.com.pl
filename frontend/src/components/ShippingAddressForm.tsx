import { useState, type FormEvent } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hook.ts";
import { type RootState } from "@/store/store";
import { saveShippingAddress } from "@/store/cartSlice";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ShippingAddressForm = () => {
  const { t } = useTranslation();
  const { shippingAddress } = useAppSelector((state: RootState) => state.cart);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [code, setCode] = useState(shippingAddress.code);

  function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAddress(e.currentTarget.value);
  }

  function handleCityChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCity(e.currentTarget.value);
  }

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.currentTarget.value);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, code }));

    navigate("/payment");
  }

  function cancelHandler() {
    navigate("..");
  }

  return (
    <div>
      <h2 className="h2-semibold mt-4">{t("shippingAddressForm.title")}</h2>
      <p className="text-base font-light mt-2 ">
        {t("shippingAddressForm.description")}
      </p>
      <form onSubmit={handleSubmit}>
        <p className="flex flex-col space-y-2 my-4">
          <Label htmlFor="address">{t("shippingAddressForm.address_text")}</Label>
          <Input
            id="address"
            type="text"
            name="address"
            value={address}
            onChange={handleAddressChange}
            placeholder={t("shippingAddressForm.address_placeholder")}
          />
        </p>
        <p className="flex flex-col space-y-2 my-4">
          <Label htmlFor="city">{t("shippingAddressForm.city_text")}</Label>
          <Input
            id="city"
            type="text"
            name="city"
            value={city}
            onChange={handleCityChange}
            placeholder={t("shippingAddressForm.city_placeholder")}
          />
        </p>
        <p className="flex flex-col space-y-2 my-4">
          <Label htmlFor="code">{t("shippingAddressForm.code_text")}</Label>
          <Input
            id="code"
            type="text"
            name="code"
            value={code}
            onChange={handleCodeChange}
            placeholder={t("shippingAddressForm.code_placeholder")}
          />
        </p>
        <p className="flex flex-col space-y-2 my-4">
          <Label htmlFor="country">{t("shippingAddressForm.country_text")}</Label>
          <Input
            id="country"
            type="text"
            name="country"
            defaultValue="Polska"
            readOnly={true}
          />
        </p>
        <div className="flex justify-end gap-x-4">
          <Button type="button" variant="outline" onClick={cancelHandler}>
            {t("shippingAddressForm.button_cancel")}
          </Button>
          <Button type="submit">{t("shippingAddressForm.button_text")}</Button>
        </div>
      </form>
    </div>
  );
};

export default ShippingAddressForm;
