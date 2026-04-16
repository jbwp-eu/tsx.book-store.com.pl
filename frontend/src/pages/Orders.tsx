import { NavLink, useLoaderData, type LoaderFunction } from "react-router-dom";
import { toast } from "sonner";
import Message from "@/components/Message";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formateDate, formatId } from "@/utils/formatUtils";
import { Button } from "@/components/ui/button";
import type { MessageProps, Order } from "@/types";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

const loader =
  (language: string): LoaderFunction =>
  async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/orders/mine?language=${language}`,
      {
        headers: {
          authorization: "Bearer " + token,
        },
      }
    );
    if (!response.ok) {
      const resData = await response.json();
      toast.error(resData.message);
      return resData;
    } else {
      return response;
    }
  };

const OrdersPage = () => {
  const { t } = useTranslation();

  const data = useLoaderData<Order[] | MessageProps>();

  let content;

  if ("message" in data) {
    content = <Message info>{data.message}</Message>;
  } else {
    content = (
      <div>
        <h2 className="h2-semibold py-4">{t("orders.title")}</h2>
        <div>
          <Table className="hidden md:table">
            <TableHeader>
              <TableRow>
                <TableHead>{t("orders.id")}</TableHead>
                <TableHead className="text-center">{t("orders.date")}</TableHead>
                <TableHead className="text-center">
                  {t("orders.total")}
                </TableHead>
                <TableHead className="text-center">{t("orders.paid")}</TableHead>
                <TableHead className="text-center">
                  {t("orders.delivered")}
                </TableHead>
                <TableHead className="text-right">
                  {t("orders.actions")}{" "}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{formatId(order.id)}</TableCell>
                  <TableCell className="text-center">
                    {formateDate(order.createdAt).substring(0, 17)}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatCurrency(order.totalPrice)}
                  </TableCell>
                  <TableCell>
                    <span className="flex justify-center">
                      {order.isPaid && order.paidAt ? (
                        formateDate(order.paidAt)
                      ) : (
                        <X className="text-red-600" />
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="text-center ">
                    <span className="flex justify-center">
                      {order.isDelivered && order.deliveredAt ? (
                        formateDate(order.deliveredAt).substring(0, 10)
                      ) : (
                        <X className="text-red-600" />
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline">
                      <NavLink to={`/order/${order.id}/checkout`}>
                        {t("orders.details")}
                      </NavLink>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data.map((order) => (
            <Card key={order.id} className="block md:hidden p-4 mb-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead>{t("orders.id")}</TableHead>
                    <TableCell>{formatId(order.id)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>{t("orders.date")}</TableHead>
                    <TableCell>
                      {formateDate(order.createdAt).substring(0, 17)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>{t("orders.total")}</TableHead>
                    <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>{t("orders.paid")}</TableHead>
                    <TableCell>
                      <span>
                        {order.isPaid && order.paidAt ? (
                          formateDate(order.paidAt)
                        ) : (
                          <X className="text-red-600" />
                        )}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>{t("orders.delivered")}</TableHead>
                    <TableCell>
                      <span>
                        {order.isDelivered && order.deliveredAt ? (
                          formateDate(order.deliveredAt).substring(0, 10)
                        ) : (
                          <X className="text-red-600" />
                        )}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>{t("orders.actions")}</TableHead>
                    <TableCell>
                      <Button asChild variant="outline">
                        <NavLink to={`/order/${order.id}/checkout`}>
                          {t("orders.details")}
                        </NavLink>
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return <>{content}</>;
};

OrdersPage.loader = loader;

export default OrdersPage;
