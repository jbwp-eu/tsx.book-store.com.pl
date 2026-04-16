import {
  NavLink,
  redirect,
  useLoaderData,
  useSubmit,
  type ActionFunctionArgs,
  type LoaderFunction,
} from "react-router-dom";

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
import { formatCurrency, formatId } from "@/utils/formatUtils";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/DeleteDialog";
import Pagination from "@/components/Pagination";
import type { DataProducts, MessageProps } from "@/types";
import { useTranslation } from "react-i18next";

const loader =
  (language: string): LoaderFunction =>
  async ({ params }) => {
    const { pageNumber } = params;

    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/products?pageNumber=${pageNumber}&language=${language}`
    );
    if (!response.ok) {
      const resData = await response.json();
      toast.error(resData.message);
      return resData;
    } else {
      return response;
    }
  };

const ProductsListPage = () => {
  const { t } = useTranslation();
  const data = useLoaderData<DataProducts | MessageProps>();
  const submit = useSubmit();

  const deleteProductHandler = (id: string) => {
    submit(
      { id, intent: "delete" },
      { method: "delete", encType: "application/json" }
    );
  };

  const createProductHandler = () => {
    submit(
      { intent: "create" },
      { method: "post", encType: "application/json" }
    );
  };

  let content;

  if ("message" in data) {
    content = (
      <div>
        <Button className="float-right mb-4" onClick={createProductHandler}>
          {t("productsList.create")}
        </Button>
        <Message info>{data.message}</Message>
      </div>
    );
  } else {
    const { products, pages } = data;
    content = (
      <div>
        <h2 className="h2-semibold py-4">{t("productsList.title_text")}</h2>
        <Button className="float-right mb-4" onClick={createProductHandler}>
          {t("productsList.create")}
        </Button>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("productsList.id")}</TableHead>
              <TableHead className="text-center">
                {t("productsList.title")}
              </TableHead>
              <TableHead className="text-center">
                {t("productsList.category")}
              </TableHead>
              <TableHead className="text-center">
                {t("productsList.price")}
              </TableHead>
              <TableHead className="text-center">
                {t("productsList.countInStock_text")}
              </TableHead>
              <TableHead className="text-right">
                {t("productsList.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="even:bg-gray-50">
                <TableCell>{formatId(product.id)}</TableCell>
                <TableCell className="text-center">{product.title}</TableCell>
                <TableCell className="text-center">
                  {product.category}
                </TableCell>
                <TableCell className="text-center">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell className="text-center">
                  {product.countInStock}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button asChild variant="outline">
                    <NavLink to={`/admin/product/${product.id}/edit`}>
                      {t("productsList.edit")}
                    </NavLink>
                  </Button>
                  <DeleteDialog
                    onDelete={() => deleteProductHandler(product.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination pages={pages} mode="productsList" />
      </div>
    );
  }

  return content;
};

const action =
  (language: string) =>
  async ({ request }: ActionFunctionArgs) => {
    const { id, intent } = await request.json();
    const { method } = request;

    const token = localStorage.getItem("token");

    if (intent === "create") {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/products?language=${language}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (!response.ok) {
        const resData = await response.json();
        toast.error(resData.message);
      } else {
        const resData = await response.json();
        toast.success(resData.message);
        return redirect(`/admin/productsList/page/${resData.pages}`);
      }
    }

    if (intent === "delete") {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/products/${id}?language=${language}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (!response.ok) {
        const resData = await response.json();
        toast.error(resData.message);
      } else {
        const resData = await response.json();
        toast.success(resData.message);
        return redirect(`/admin/productsList/page/${resData.pages}`);
      }
    }
  };

ProductsListPage.action = action;
ProductsListPage.loader = loader;
export default ProductsListPage;
