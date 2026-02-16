import {
  type DataProducts,
  type MessageProps,
  type Product,
} from "@/types/index.ts";
import { type LoaderFunction, Outlet, useLoaderData } from "react-router-dom";
import { toast } from "sonner";
import Products from "@/components/Products.tsx";
import Message from "@/components/Message.tsx";

import { useContext } from "react";
import StateContextProvider from "@/components/StateContext";

const loader =
  (language: string): LoaderFunction =>
  async ({
    params,
    request,
  }): Promise<{ products: Product[]; pages: number } | Response> => {
    const { pageNumber } = params;
    const searchParams = Object.fromEntries(new URL(request.url).searchParams);

    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/products?pageNumber=${pageNumber}&language=${language}&${new URLSearchParams(
        searchParams
      )}`
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

const HomePage = () => {
  // const [searchParams] = useSearchParams();
  // const flag = searchParams.has("search");
  const data = useLoaderData<DataProducts | MessageProps>();

  const { isCarousel } = useContext(StateContextProvider.Context);
  let content;

  if ("message" in data) {
    content = <Message info>{data.message}</Message>;
  } else {
    const { products, pages } = data;
    content = (
      <div className="flex flex-col">
        {/* {isCarousel && <ProductCarousel products={products} />} */}
        {isCarousel && <Outlet />}
        <Products products={products} pages={pages} />
      </div>
    );
  }
  return content;
};

HomePage.loader = loader;
export default HomePage;
