import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dictionary, { type ObjectDict } from "@/dictionaries/dictionary";
import type { Order } from "@/types";
import { useAppSelector } from "@/store/hook";
import type { RootState } from "@/store/store";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/utils/formatUtils";
import Image from "./Image";

const OrderInformation = ({ order }: { order: Order }) => {
  const { language } = useAppSelector((state: RootState) => state.ui);
  const {
    paymentMethod,
    shippingAddress,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    OrderItems,
  } = order;
  const {
    paymentMethod_text,
    paymentMethod_textPL,
    shippingAddress_text,
    shippingAddress_textPL,
    notPaid,
    notPaidPL,
    notDelivered,
    notDeliveredPL,
    paidAt_text,
    paidAt_textPL,
    delivered_text,
    delivered_textPL,
    orderItems,
    orderItemsPL,
    item_text,
    quantity_text,
    price_text,
    item_textPL,
    quantity_textPL,
    price_textPL,
  } = dictionary.order as ObjectDict;
  return (
    <div className="grid md:col-span-2 gap-y-4">
      <Card>
        <CardContent>
          <h3 className="h3-semibold mb-2">
            {language === "en" ? paymentMethod_text : paymentMethod_textPL}
          </h3>
          <p>{paymentMethod}</p>
          {isPaid && paidAt ? (
            <Badge variant="secondary" className="mt-4">
              {language === "en" ? paidAt_text : paidAt_textPL}{" "}
              {new Date(paidAt).toLocaleString()}
            </Badge>
          ) : (
            <Badge variant="destructive" className="mt-4">
              {language === "en" ? notPaid : notPaidPL}
            </Badge>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h3 className="h3-semibold mb-2">
            {language === "en" ? shippingAddress_text : shippingAddress_textPL}
          </h3>
          <p>{shippingAddress.address}</p>
          <p>{shippingAddress.city}</p>
          <p>{shippingAddress.code}</p>
          {isDelivered && deliveredAt ? (
            <Badge variant="secondary" className="mt-4">
              {language === "en" ? delivered_text : delivered_textPL}{" "}
              {new Date(deliveredAt.toString())
                .toLocaleString()
                .substring(0, 10)}
            </Badge>
          ) : (
            <Badge variant="destructive" className="mt-4">
              {language === "en" ? notDelivered : notDeliveredPL}
            </Badge>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h3 className="h3-semibold mb-2">
            {language === "en" ? orderItems : orderItemsPL}
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {language === "en" ? item_text : item_textPL}
                </TableHead>
                <TableHead className="text-center">
                  {language === "en" ? quantity_text : quantity_textPL}
                </TableHead>
                <TableHead className="text-right">
                  {language === "en" ? price_text : price_textPL}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {OrderItems?.map((orderItem) => (
                <TableRow key={orderItem.id}>
                  <TableCell>
                    <Link
                      to={`/product/${orderItem.product}`}
                      className="flex gap-4 items-center"
                    >
                      <Image image={orderItem.images[0]} className="w-15" />
                      <span className="font-medium px-2">
                        {orderItem.title}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    {orderItem.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(orderItem.price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderInformation;
