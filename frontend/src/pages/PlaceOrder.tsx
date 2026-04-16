import CheckoutSteps from "@/components/CheckoutSteps";
import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector } from "@/store/hook.ts";
import { type RootState } from "@/store/store";
import { Link, redirect, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "sonner";
import { type ActionFunctionArgs } from "react-router-dom";
import { type AppDispatch } from "@/store/store";
import { useSubmit } from "react-router-dom";
import { clearCartItems } from "@/store/cartSlice";
import { useEffect } from "react";
import { formatCurrency } from "@/utils/formatUtils";
import Image from "@/components/Image";
import { useTranslation } from "react-i18next";

const PlaceOrder = () => {
  const { t } = useTranslation();

  const {
    shippingAddress,
    paymentMethod,
    cartItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = useAppSelector((state: RootState) => state.cart);

  const { address, city, code } = shippingAddress;
  const navigate = useNavigate();

  const submit = useSubmit();

  function onClickHandler() {
    submit(
      { orderItems: cartItems, shippingAddress, paymentMethod },
      { method: "post", encType: "application/json" }
    );
  }

  useEffect(() => {
    if (!address || !city || !code) {
      navigate("/shipping");
    } else if (!paymentMethod) {
      navigate("/payment");
    }
  }, [address, city, code, paymentMethod, navigate]);

  return (
    <div>
      <CheckoutSteps current={3} />
      <h2 className="h2-semibold py-4">{t("placeOrder.title")}</h2>
      <div className="grid sm:grid-cols-5 gap-4">
        <div className="sm:col-span-3 space-y-4">
          <Card>
            <CardContent>
              <p className="text-lg lg:text-xl font-semibold ">
                {t("placeOrder.shippingAddress_text")}
              </p>
              <p>{shippingAddress.address}</p>
              <p>{shippingAddress.code}</p>
              <p>{shippingAddress.city}</p>
              <Link to="/shipping">
                <Button variant="outline" className="mt-2">
                  {t("placeOrder.button_text")}
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-lg lg:text-xl font-semibold ">
                {t("placeOrder.paymentMethod_text")}
              </p>
              <p>{paymentMethod}</p>
              <Link to="/payment">
                <Button variant="outline" className="mt-2">
                  {t("placeOrder.button_text")}
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-lg lg:text-xl font-semibold ">
                {t("placeOrder.orderItems_text")}
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("placeOrder.item")}</TableHead>
                    <TableHead className="text-center">
                      {t("placeOrder.quantity")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("placeOrder.price")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Link
                          to={`/product/${item.id}`}
                          className="flex items-center gap-4"
                        >
                          <Image image={item.images[0]} className="w-15" />
                          <span>{item.title}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="sm:col-span-2">
          <Card>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <p>{t("placeOrder.items")}</p>
                <p>{formatCurrency(itemsPrice)}</p>
              </div>
              <div className="flex justify-between">
                <p>{t("placeOrder.tax")}</p>
                <p>{formatCurrency(taxPrice)}</p>
              </div>
              <div className="flex justify-between">
                <p>{t("placeOrder.shipping")}</p>
                <p>{formatCurrency(shippingPrice)}</p>
              </div>
              <div className="flex justify-between font-semibold">
                <p>{t("placeOrder.total")}</p>
                <p>{formatCurrency(totalPrice)}</p>
              </div>
              <Button className="float-right " onClick={onClickHandler}>
                {t("placeOrder.button_order")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const action =
  (dispatch: AppDispatch, language: string) =>
  async ({ request }: ActionFunctionArgs) => {
    const data = await request.json();

    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/orders?language=${language}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const responseData = await response.json();
      toast.error(responseData.message);
      return redirect("/");
    } else {
      const resData = await response.json();
      const { createdOrder, message } = resData;
      toast.success(message);
      dispatch(clearCartItems());
      return redirect(`/order/${createdOrder.id}/checkout`);
    }
  };

PlaceOrder.action = action;

export default PlaceOrder;
