import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLoaderData } from "react-router-dom";
import { Barcode } from "lucide-react";
import { CreditCard } from "lucide-react";
import { Users } from "lucide-react";
import { Star } from "lucide-react";
import { BadgeDollarSign } from "lucide-react";
import Message from "@/components/Message";
import { toast } from "sonner";
import {
  formatCurrency,
  formateDate,
  integerFormatCurrency,
} from "@/utils/formatUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MessageProps, Order } from "@/types";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const loader = (language: string) => async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/overview?language=${language}`,
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

type OverviewData = {
  productsCount: number;
  usersCount: number;
  ordersCount: number;
  reviewsCount: number;
  totalSales: number;
  orders: Order[];
  salesData: { Date: Date; Total: number }[];
};

const OverviewPage = () => {
  const { t } = useTranslation();
  const data = useLoaderData<OverviewData | MessageProps>();

  const chartConfig = useMemo(
    () => ({
      totalPrice: {
        label: t("overview.chart_orders_value"),
        color: "#778899",
      },
    }),
    [t]
  );

  if ("message" in data) {
    return <Message info>{data.message}</Message>;
  }

  const {
    productsCount,
    usersCount,
    ordersCount,
    reviewsCount,
    totalSales,
    orders,
    salesData,
  } = data;

  const chartData = salesData.map((orders) => {
    return { createdAt: orders.Date, totalPrice: orders.Total };
  });

  return (
    <div className="space-y-4">
      <h2 className="h2-semibold py-4">{t("overview.title_text")}</h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 ">
        <Card className="col-span-1">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>{t("overview.title_revenues")}</CardTitle>{" "}
            <BadgeDollarSign />
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className="font-semibold text-2xl">
              {formatCurrency(totalSales)}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>{t("overview.title_products")}</CardTitle>{" "}
            <Barcode />
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className="font-semibold text-2xl">{productsCount}</div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex justify-between items-center ">
            <CardTitle>{t("overview.title_orders")}</CardTitle>{" "}
            <Barcode />
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className="font-semibold text-2xl">{ordersCount}</div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex justify-between items-center ">
            <CardTitle>{t("overview.title_customers")}</CardTitle>{" "}
            <Users />
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className="font-semibold text-2xl">{usersCount}</div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex justify-between items-center ">
            <CardTitle>{t("overview.title_reviews")}</CardTitle>{" "}
            <Star />
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className="font-semibold text-2xl">{reviewsCount}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid md:grid-cols-7 gap-4">
        <Card className="col-span-1 md:col-span-4 px-2 ">
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="createdAt"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(5, 10)}
              />
              <YAxis
                dataKey="totalPrice"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => integerFormatCurrency(value)}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="totalPrice"
                fill="var(--color-totalPrice)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </Card>
        <Card className="col-span-1 md:col-span-3 px-2 ">
          {orders.length !== 0 ? (
            <div>
              <CardHeader className="pb-4 px-2">
                <CardTitle>{t("overview.title_recent")}</CardTitle>
              </CardHeader>
              <div>
                {orders.map((order) => (
                  <Card
                    key={order.id}
                    className="p-4 mt-2 block sm:hidden md:block lg:hidden"
                  >
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableHead>{t("overview.buyer")}</TableHead>
                          <TableCell className="text-left">
                            {order.User!.name}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>{t("overview.date")}</TableHead>
                          <TableCell className="text-left">
                            {" "}
                            {formateDate(order.createdAt)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>{t("overview.total")}</TableHead>
                          <TableCell className="text-left">
                            {formatCurrency(order.totalPrice)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>{t("overview.actions")}</TableHead>
                          <TableCell className="text-left">
                            <Button variant="outline" asChild>
                              <Link to={`/order/${order.id}`}>
                                {t("overview.details")}
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Card>
                ))}

                <Table className="hidden sm:table md:hidden lg:table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">
                        {t("overview.buyer")}
                      </TableHead>
                      <TableHead className="text-center">
                        {t("overview.date")}
                      </TableHead>
                      <TableHead className="text-center">
                        {t("overview.total")}
                      </TableHead>
                      <TableHead className="text-center">
                        {t("overview.actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="text-center">
                          {order.User!.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {formateDate(order.createdAt)}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatCurrency(order.totalPrice)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button variant="outline" asChild>
                            <Link to={`/order/${order.id}`}>
                              {t("overview.details")}
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <CardTitle>{t("overview.title_no_orders")}</CardTitle>
          )}
        </Card>
      </div>
    </div>
  );
};

OverviewPage.loader = loader;

export default OverviewPage;
