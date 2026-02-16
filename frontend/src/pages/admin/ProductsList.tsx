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
import dictionary, { type ObjectDict } from "@/dictionaries/dictionary.ts";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
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
  const data = useLoaderData<DataProducts | MessageProps>();
  const { language } = useSelector((state: RootState) => state.ui);
  const submit = useSubmit();

  const {
    title_text,
    title_textPL,
    id,
    idPL,
    title,
    titlePL,
    category,
    categoryPL,
    price,
    pricePL,
    countInStock_text,
    countInStock_textPL,
    actions,
    actionsPL,
    edit,
    editPL,
    create,
    createPL,
  } = dictionary.productsList as ObjectDict;

  const deleteProductHandler = (id: string) => {
    submit(
      { id, intent: "delete" },
      { method: "delete", encType: "application/json" }
    );
    // submit(id, { method: "post", encType: "text/plain" });
    // submit(
    //   { id },
    //   { method: "post", encType: "application/x-www-form-urlencoded" }
    // );
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
          {language === "en" ? create : createPL}
        </Button>
        <Message info>{data.message}</Message>;
      </div>
    );
  } else {
    const { products, pages } = data;
    content = (
      <div>
        <h2 className="h2-semibold py-4">
          {language === "en" ? title_text : title_textPL}
        </h2>
        <Button className="float-right mb-4" onClick={createProductHandler}>
          {language === "en" ? create : createPL}
        </Button>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{language === "en" ? id : idPL}</TableHead>
              <TableHead className="text-center">
                {language === "en" ? title : titlePL}
              </TableHead>
              <TableHead className="text-center">
                {language === "en" ? category : categoryPL}
              </TableHead>
              <TableHead className="text-center">
                {language === "en" ? price : pricePL}
              </TableHead>
              <TableHead className="text-center">
                {language === "en" ? countInStock_text : countInStock_textPL}
              </TableHead>
              <TableHead className="text-right">
                {language === "en" ? actions : actionsPL}
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
                      {language === "en" ? edit : editPL}
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
    // const id = await request.text();
    // const formData = await request.formData();
    // console.log("id_action:", formData.get("id"));

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
        // throw new Error(resData.message);
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
        // throw new Error(resData.message);
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
