import Message from "@/components/Message";
import ProductEditForm from "@/components/ProductEditForm";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import dictionary, { type ObjectDict } from "@/dictionaries/dictionary";
import type { RootState } from "@/store/store";
import type { MessageProps, Product } from "@/types";
import { useSelector } from "react-redux";
import {
  NavLink,
  redirect,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunction,
} from "react-router-dom";
import { toast } from "sonner";

const loader =
  (language: string): LoaderFunction =>
  async ({ params }) => {
    const { id } = params;
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/products/${id}?language=${language}`
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

const ProductEditPage = () => {
  const data = useLoaderData<Product | MessageProps>();

  const { language } = useSelector((state: RootState) => state.ui);

  const { goBack, goBackPL } = dictionary.productEdit as ObjectDict;

  let content;

  if ("message" in data) {
    content = <Message info>{data.message}</Message>;
  } else {
    content = (
      <div className="max-w-3xl mx-auto">
        <Button asChild variant="outline" className="mt-8">
          <NavLink to="/admin/productsList">
            {language === "en" ? goBack : goBackPL}
          </NavLink>
        </Button>
        <Card className="mx-auto mt-8">
          <CardContent>
            <ProductEditForm product={data} />
          </CardContent>
        </Card>
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

    // const data = await request.json();

    const data = await request.formData();

    // const updatedProduct = {
    //   title: data.get("title"),
    //   category: data.get("category"),
    //   // image: data.get("image"),
    //   countInStock: data.get("countInStock"),
    //   price: data.get("price"),
    //   description: data.get("description"),
    // };

    /* 1 */
    // console.log("title", data.get("title"));
    /* 2 */
    // console.log(language, data.get("enteredTitle"));
    // console.log({ method, id, token });
    // console.log("data.get.title:", data.get("title"));
    // console.log("data.get.iamges:", data.get("images"));
    // console.log("data.get.banner:", data.get("banner"));

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/products/${id}?language=${language}`,
      {
        method,
        headers: {
          // "Content-Type": "application/json",
          // "Content-Type": "application/x-www-form-urlencoded",
          // "Content-Type": "multipart/form-data",
          authorization: "Bearer " + token,
        },
        // body: JSON.stringify(updatedProduct),
        body: data,
      }
    );
    if (!response.ok) {
      const resData = await response.json();
      // throw new Error(resData.message);
      toast.error(resData.message);
    } else {
      const resData = await response.json();
      const { message, page } = resData;
      toast.success(message);
      return redirect(`/page/${page}`);
    }
  };

ProductEditPage.loader = loader;
ProductEditPage.action = action;

export default ProductEditPage;
