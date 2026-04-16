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

  return (
    <div>
      <h2 className="h2-semibold py-4">{t("cart.title")}</h2>
      {cartItems.length === 0 ? (
        <Message info>{t("cart.message")}</Message>
      ) : (
        <div className="grid sm:grid-cols-5 gap-x-4 gap-y-4">
          <div className="sm:col-span-3">
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
                    <TableCell>
                      <NavLink
                        to={`/product/${item.id}`}
                        className="flex gap-4 items-center"
                      >
                        <Image image={item.images[0]} className="w-20" />
                        <span className="font-medium px-2">{item.title}</span>
                      </NavLink>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-center">
                        <Button
                          variant="outline"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <Minus />
                        </Button>
                        <span className="px-2">{item.quantity}</span>
                        <Button
                          variant="outline"
                          onClick={() => handleAddToCart(item)}
                          disabled={item.countInStock === item.quantity}
                        >
                          <Plus />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card className="sm:col-span-2 self-start min-h-40">
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
