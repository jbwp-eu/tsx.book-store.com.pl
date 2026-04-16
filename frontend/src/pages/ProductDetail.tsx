import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunction,
} from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import Message from "@/components/Message.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { type RootState } from "@/store/store.ts";
import ReviewList from "@/components/ReviewList.tsx";
import Rating from "@/components/Rating.tsx";
import ProductPrice from "@/components/ProductPrice.tsx";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button.tsx";
import { addItemToCart, removeItemFromCart } from "@/store/cartSlice.ts";
import { Plus, Minus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook.ts";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { type MessageProps, type Product } from "@/types";
import { formatCurrency } from "@/utils/formatUtils";
import ProductImages from "../components/ProductImages";
import { useTranslation } from "react-i18next";

const loader =
  (language: string): LoaderFunction =>
  async ({ params }): Promise<{ product: Product } | Response> => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/products/${
        params.id
      }?language=${language}`
    );

    if (!response.ok) {
      const resData = await response.json();
      toast.error(resData.message);
      return resData;
    } else {
      return response;
    }
  };

export const ProductDetailPage = () => {
  const { t } = useTranslation();
  const data = useLoaderData<Product | MessageProps>();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { cartItems } = useAppSelector((state: RootState) => state.cart);

  let content;

  if ("message" in data) {
    content = <Message info>{data.message}</Message>;
  } else {
    const {
      id,
      images,
      title,
      price,
      description,
      countInStock,
      rating,
      numReviews,
    } = data;

    const existItem =
      cartItems.length > 0 && cartItems.find((x) => x.id === id);

    function handleAddToCart() {
      dispatch(addItemToCart({ id, title, images, price, countInStock }));
      toast.success(t("productDetail.toast_added", { title }), {
        cancel: {
          label: t("productDetail.toast_go_cart"),
          onClick: () => navigate("/cart"),
        },
      });
      navigate("/cart");
    }

    function handleRemoveFromCart() {
      dispatch(removeItemFromCart(id));
      toast.error(t("productDetail.toast_removed", { title }));
    }

    content = (
      <div>
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-6">
            <div className="col-span-2">
              <ProductImages images={data.images} />
            </div>

            <div className="col-span-2 p-5">
              <div className="flex flex-col gap-6">
                <p>{t("productDetail.category")}</p>
                <h3 className="h3-bold">{title}</h3>
                <Rating value={rating} />
                <p>
                  {t("productDetail.review_text")} {numReviews}
                </p>
                <ProductPrice className="bg-green-100 rounded-full w-30 px-5 py-2 text-green-700">
                  {formatCurrency(price)}
                </ProductPrice>
                <div className="space-y-1 mt-2">
                  <p className="font-semibold">
                    {t("productDetail.description_text")}
                  </p>
                  <p>{description}</p>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <Card>
                <CardContent className="p-4 flex flex-col gap-4">
                  <div className="flex justify-between">
                    <div>{t("productDetail.price_text")}</div>
                    {formatCurrency(price)}
                  </div>
                  <div className="flex justify-between">
                    <p>{t("productDetail.status")}</p>

                    {countInStock > 0 ? (
                      <div>
                        {existItem && existItem.quantity < countInStock ? (
                          <Badge variant="outline">
                            {t("productDetail.in_stock")}
                          </Badge>
                        ) : existItem && existItem.quantity >= countInStock ? (
                          <Badge variant="destructive">
                            {t("productDetail.out_of_stock")}
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            {t("productDetail.in_stock")}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <Badge variant="destructive">
                        {t("productDetail.out_of_stock")}
                      </Badge>
                    )}
                  </div>

                  {countInStock > 0 && (
                    <div>
                      {existItem && existItem.quantity <= countInStock ? (
                        <div className="flex justify-between items-center">
                          <p>{t("productDetail.quantity")}</p>
                          <div className="space-x-2">
                            <Button
                              variant="outline"
                              onClick={handleRemoveFromCart}
                            >
                              <Minus />
                            </Button>
                            <span className="px-2">{existItem.quantity}</span>
                            <Button
                              variant="outline"
                              onClick={handleAddToCart}
                              disabled={countInStock === existItem.quantity}
                            >
                              <Plus />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button className="w-full" onClick={handleAddToCart}>
                          {t("productDetail.cart_button")}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section>
          <h2 className="h2-bold my-4">{t("productDetail.review_title")}</h2>
          <ReviewList product={data} />
        </section>
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

    const data = await request.json();

    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/products/${id}/reviews?language=${language}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const resData = await response.json();
      toast.error(resData.message);
    } else {
      const resData = await response.json();
      toast.success(resData.message);
      return redirect(`/product/${id}`);
    }
  };

ProductDetailPage.action = action;

ProductDetailPage.loader = loader;

export default ProductDetailPage;
