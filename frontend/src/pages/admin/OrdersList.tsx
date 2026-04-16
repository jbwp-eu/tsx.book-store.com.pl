import Message from "@/components/Message";
import {
  NavLink,
  useLoaderData,
  useSubmit,
  type ActionFunctionArgs,
  type LoaderFunction,
} from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatCurrency, formatId } from "@/utils/formatUtils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DeleteDialog from "@/components/DeleteDialog";
import type { MessageProps, Order } from "@/types";
import Pagination from "@/components/Pagination";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

const loader =
  (language: string): LoaderFunction =>
  async ({ params }) => {
    const token = localStorage.getItem("token");
    const { pageNumber } = params;

    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/orders?pageNumber=${pageNumber}&language=${language}`,
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

const OrdersListPage = () => {
  const { t } = useTranslation();
  const data = useLoaderData<
    { orders: Order[]; pages: number } | MessageProps
  >();

  const submit = useSubmit();

  const deleteOrderHandler = (id: string) => {
    submit(
      { id },
      {
        method: "delete",
        encType: "application/json",
      }
    );
  };

  let content;

  if ("message" in data) {
    content = <Message info>{data.message}</Message>;
  } else {
    content = (
      <div>
        <h2 className="h2-semibold py-4">{t("ordersList.title")}</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("ordersList.id")}</TableHead>
              <TableHead className="text-center">
                {t("ordersList.name")}
              </TableHead>
              <TableHead className="text-center">
                {t("ordersList.date")}
              </TableHead>
              <TableHead className="text-center">
                {t("ordersList.total")}
              </TableHead>
              <TableHead className="text-center">
                {t("ordersList.paid")}
              </TableHead>
              <TableHead className="text-center">
                {t("ordersList.delivered")}
              </TableHead>
              <TableHead className="text-right">
                {t("ordersList.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.orders.map((order) => (
              <TableRow key={order.id} className="even:bg-gray-50">
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell className="text-center">
                  {order.User!.name}
                </TableCell>
                <TableCell className="text-center">
                  {new Date(order.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  {formatCurrency(order.totalPrice)}
                </TableCell>
                <TableCell className="text-center">
                  {order.isPaid && order.paidAt ? (
                    new Date(order.paidAt).toLocaleString()
                  ) : (
                    <div className="flex justify-center">
                      <X className="text-red-600" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {order.isDelivered && order.deliveredAt ? (
                    new Date(order.deliveredAt)
                      .toLocaleString()
                      .substring(0, 10)
                  ) : (
                    <div className="flex justify-center">
                      <X className="text-red-600" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-4">
                  <Button asChild variant="outline">
                    <NavLink to={`/order/${order.id}`}>
                      {t("ordersList.details")}
                    </NavLink>
                  </Button>
                  <DeleteDialog onDelete={() => deleteOrderHandler(order.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination pages={data.pages} mode="ordersList" />
      </div>
    );
  }

  return <>{content}</>;
};

const action =
  (language: string) =>
  async ({ request }: ActionFunctionArgs) => {
    const { id } = await request.json();
    const { method } = request;
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/orders/${id}?language=${language}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
      }
    );
    if (!response.ok) {
      const resData = await response.json();
      toast.error(resData.message);
    } else {
      const resData = await response.json();
      toast.success(resData.message);
    }
  };

OrdersListPage.action = action;
OrdersListPage.loader = loader;
export default OrdersListPage;
