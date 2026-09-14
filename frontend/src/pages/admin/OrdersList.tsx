import Message from "@/components/Message";
import {
  NavLink,
  redirect,
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
import { env } from "@/lib/env";

const loader =
  (language: string): LoaderFunction =>
  async ({ params }) => {
    const token = localStorage.getItem("token");
    const { pageNumber } = params;

    const response = await fetch(
      `${
        env.backendUrl
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
  } else if (data.orders.length === 0) {
    content = (
      <div>
        <h2 className="h2-semibold py-4">{t("ordersList.title")}</h2>
        <Message info>{t("ordersList.noOrders")}</Message>
      </div>
    );
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
                  {order.User?.name ?? t("ordersList.deleted_user")}
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
  async ({ request, params }: ActionFunctionArgs) => {
    const { id } = await request.json();
    const { method } = request;
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${env.backendUrl}/orders/${id}?language=${language}`,
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
      return null;
    }

    const resData = (await response.json()) as {
      message: string;
      pages?: number;
    };
    toast.success(resData.message);

    const currentPage = Number(params.pageNumber) || 1;
    const pages = resData.pages ?? 0;
    if (pages <= 1) {
      return redirect("/admin/ordersList");
    }
    const nextPage = Math.min(currentPage, pages);
    return redirect(`/admin/ordersList/page/${nextPage}`);
  };

OrdersListPage.action = action;
OrdersListPage.loader = loader;
export default OrdersListPage;
