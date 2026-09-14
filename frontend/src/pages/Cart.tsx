import { type RootState } from "@/store/store";
import Message from "@/components/Message";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NavLink, useNavigate } from "react-router-dom";
import { addItemToCart, removeItemFromCart } from "@/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { ArrowRight, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type CartItem } from "@/store/cartSlice";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatUtils";
import Image from "@/components/Image";
import { useTranslation } from "react-i18next";

const CartPage = () => {
  const { t } = useTranslation();
  const { cartItems, itemsQuantity, itemsPrice } = useAppSelector(
    (state: RootState) => state.cart
  );

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  function handleAddToCart(item: CartItem) {
    dispatch(addItemToCart(item));
  }

  function handleRemoveFromCart(id: string) {
    dispatch(removeItemFromCart(id));
  }

  function checkoutHandler() {
    navigate("/login?redirect=/shipping");
  }

  function quantityControls(item: CartItem) {
    return (
      <div className="flex items-center justify-center shrink-0">
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => handleRemoveFromCart(item.id)}
        >
          <Minus />
        </Button>
        <span className="min-w-8 px-2 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => handleAddToCart(item)}
          disabled={item.countInStock === item.quantity}
        >
          <Plus />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="h2-semibold py-4">{t("cart.title")}</h2>
      {cartItems.length === 0 ? (
        <Message info>{t("cart.message")}</Message>
      ) : (
        <div className="grid md:grid-cols-5 gap-x-4 gap-y-4">
          <div className="md:col-span-3">
            <ul className="md:hidden divide-y">
              {cartItems.map((item) => (
                <li key={item.id} className="space-y-3 py-4 first:pt-0">
                  <NavLink
                    to={`/product/${item.id}`}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <Image image={item.images[0]} className="w-16 shrink-0" />
                    <span className="min-w-0 break-words font-medium">
                      {item.title}
                    </span>
                  </NavLink>
                  <div className="flex items-center justify-between gap-3">
                    {quantityControls(item)}
                    <span className="font-medium">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("cart.table_item")}</TableHead>
                    <TableHead className="text-center">
                      {t("cart.table_qty")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("cart.table_price")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="whitespace-normal">
                        <NavLink
                          to={`/product/${item.id}`}
                          className="flex min-w-0 items-center gap-4"
                        >
                          <Image
                            image={item.images[0]}
                            className="w-20 shrink-0"
                          />
                          <span className="min-w-0 break-words px-2 font-medium">
                            {item.title}
                          </span>
                        </NavLink>
                      </TableCell>
                      <TableCell className="text-center">
                        {quantityControls(item)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <Card className="md:col-span-2 self-start min-h-40">
            <CardContent>
              <div className="text-xl">
                {t("cart.subtotal")}({itemsQuantity}):
                <span className="font-bold ml-2">
                  {formatCurrency(itemsPrice)}
                </span>
              </div>
              <Button className="mt-4 float-right" onClick={checkoutHandler}>
                <ArrowRight />
                {t("cart.button_text")}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CartPage;
