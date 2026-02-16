import { useState, type FormEvent } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hook.ts";
import { type RootState } from "@/store/store";
import { saveShippingAddress } from "@/store/cartSlice";
import dictionary from "@/dictionaries/dictionary";
import { type ObjectDict } from "@/dictionaries/dictionary";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const ShippingAddressForm = () => {
  const { shippingAddress } = useAppSelector((state: RootState) => state.cart);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [code, setCode] = useState(shippingAddress.code);
  // const [country, setCountry] = useState(shippingAddress.country);

  const { language } = useAppSelector((state: RootState) => state.ui);

  const {
    title,
    titlePL,
    description,
    descriptionPL,
    address_text,
    address_textPL,
    address_placeholder,
    address_placeholderPL,
    city_text,
    city_textPL,
    city_placeholder,
    city_placeholderPL,
    code_text,
    code_textPL,
    code_placeholder,
    code_placeholderPL,
    country_text,
    country_textPL,
    // country_placeholder,
    // country_placeholderPL,
    button_text,
    button_textPL,
    button_cancel,
    button_cancelPL,
  } = dictionary.shippingAddressForm as ObjectDict;

  function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAddress(e.currentTarget.value);
  }

  function handleCityChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCity(e.currentTarget.value);
  }

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.currentTarget.value);
  }

  // function handleCountryChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   setCountry(e.currentTarget.value);
  // }

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
      <h2 className="h2-semibold mt-4">
        {language === "en" ? title : titlePL}
      </h2>
      <p className="text-base font-light mt-2 ">
        {language === "en" ? description : descriptionPL}
      </p>
      <form onSubmit={handleSubmit}>
        <p className="flex flex-col space-y-2 my-4">
          <Label htmlFor="address">
            {language === "en" ? address_text : address_textPL}
          </Label>
          <Input
            id="address"
            type="text"
            name="address"
            value={address}
            onChange={handleAddressChange}
            placeholder={
              language === "en" ? address_placeholder : address_placeholderPL
            }
          />
        </p>
        <p className="flex flex-col space-y-2 my-4">
          <Label htmlFor="city">
            {language === "en" ? city_text : city_textPL}
          </Label>
          <Input
            id="city"
            type="text"
            name="city"
            value={city}
            onChange={handleCityChange}
            placeholder={
              language === "en" ? city_placeholder : city_placeholderPL
            }
          />
        </p>
        <p className="flex flex-col space-y-2 my-4">
          <Label htmlFor="code">
            {language === "en" ? code_text : code_textPL}
          </Label>
          <Input
            id="code"
            type="text"
            name="code"
            value={code}
            onChange={handleCodeChange}
            placeholder={
              language === "en" ? code_placeholder : code_placeholderPL
            }
          />
        </p>
        <p className="flex flex-col space-y-2 my-4">
          <Label htmlFor="country">
            {language === "en" ? country_text : country_textPL}
          </Label>
          <Input
            id="country"
            type="text"
            name="country"
            // value={country}
            // onChange={handleCountryChange}
            // placeholder={
            //   language === "en" ? country_placeholder : country_placeholderPL
            // }
            defaultValue="Polska"
            readOnly={true}
          />
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

export default ShippingAddressForm;
