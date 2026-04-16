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
import type { Order } from "@/types";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/utils/formatUtils";
import Image from "./Image";
import { useTranslation } from "react-i18next";

const OrderInformation = ({ order }: { order: Order }) => {
  const { t } = useTranslation();
  const {
    paymentMethod,
    shippingAddress,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    OrderItems,
  } = order;

  return (
    <div className="grid md:col-span-2 gap-y-4">
      <Card>
        <CardContent>
          <h3 className="h3-semibold mb-2">
            {t("order.paymentMethod_text")}
          </h3>
          <p>{paymentMethod}</p>
          {isPaid && paidAt ? (
            <Badge variant="secondary" className="mt-4">
              {t("order.paidAt_text")}{" "}
              {new Date(paidAt).toLocaleString()}
            </Badge>
          ) : (
            <Badge variant="destructive" className="mt-4">
              {t("order.notPaid")}
            </Badge>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h3 className="h3-semibold mb-2">
            {t("order.shippingAddress_text")}
          </h3>
          <p>{shippingAddress.address}</p>
          <p>{shippingAddress.city}</p>
          <p>{shippingAddress.code}</p>
          {isDelivered && deliveredAt ? (
            <Badge variant="secondary" className="mt-4">
              {t("order.delivered_text")}{" "}
              {new Date(deliveredAt.toString())
                .toLocaleString()
                .substring(0, 10)}
            </Badge>
          ) : (
            <Badge variant="destructive" className="mt-4">
              {t("order.notDelivered")}
            </Badge>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h3 className="h3-semibold mb-2">{t("order.orderItems")}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("order.item_text")}</TableHead>
                <TableHead className="text-center">
                  {t("order.quantity_text")}
                </TableHead>
                <TableHead className="text-right">
                  {t("order.price_text")}
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
