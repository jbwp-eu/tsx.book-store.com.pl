import { useLoaderData, type ActionFunctionArgs } from "react-router-dom";
import { type LoaderFunction } from "react-router-dom";
import { formatId } from "@/utils/formatUtils";

import { toast } from "sonner";

import type { MessageProps, Order } from "@/types";
import Message from "@/components/Message";
import OrderInformation from "@/components/OrderInformation";
import OrderSummary from "@/components/OrderSummary";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hook";
import { setCredentials } from "@/store/authSlice";
import { useTranslation } from "react-i18next";

const loader =
  (language: string): LoaderFunction =>
  async ({ params }) => {
    const { id } = params;
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/orders/${id}?language=${language}`,
      {
        headers: {
          authorization: "Bearer " + token,
        },
      }
    );

    if (!response.ok) {
      const resData = await response.json();
      // throw new Error(resData.message);
      toast.error(resData.message);
      return resData;
    } else {
      return response;
    }
  };

const OrderPage = () => {
  const { t } = useTranslation();
  const data = useLoaderData<Order | MessageProps>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")!);
    dispatch(setCredentials({ ...userInfo }));
  }, [dispatch]);

  let content;

  if ("message" in data) {
    content = <Message info>{data.message}</Message>;
  } else {
    content = (
      <div>
        <h2 className="h2-semibold py-4">
          {t("order.title")}{" "}
          <span className="">{formatId(data.id)}</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-x-4 ">
          <OrderInformation order={data} />
          <OrderSummary order={data} />
        </div>
      </div>
    );
  }

  return content;
};

const action =
  (language: string) =>
  async ({ request, params }: ActionFunctionArgs) => {
    const { method } = request;
    const { id } = params;

    const token = localStorage.getItem("token");
    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/orders/${id}/deliver?language=${language}`,
      {
        method,
        headers: {
          authorization: "Bearer " + token,
        },
      }
    );
    if (!response.ok) {
      const resData = await response.json();
      // throw new Error(resData.message);
      toast.error(resData.message);
    } else {
      const resData = await response.json();
      toast.success(resData.message);
    }
  };

OrderPage.action = action;
OrderPage.loader = loader;

export default OrderPage;
