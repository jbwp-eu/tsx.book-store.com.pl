import Message from "@/components/Message";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MessageProps, ProductReview } from "@/types";
import { formateDate, formatId } from "@/utils/formatUtils";
import {
  useLoaderData,
  useSubmit,
  type ActionFunctionArgs,
  type LoaderFunction,
} from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const loader =
  (language: string): LoaderFunction =>
  async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/reviews/mine?language=${language}`,
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

const ReviewsPage = () => {
  const { t } = useTranslation();
  const data = useLoaderData<ProductReview[] | MessageProps>();
  const submit = useSubmit();

  function deleteReviewHandler(id: string) {
    submit({ id }, { method: "delete", encType: "application/json" });
  }

  let content;

  if ("message" in data) {
    content = <Message info>{data.message}</Message>;
  } else {
    content = (
      <div>
        <h2 className="h2-semibold py-4">{t("reviews.title")}</h2>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("reviews.productTitle")}</TableHead>
                <TableHead>{t("reviews.id")}</TableHead>
                <TableHead className="text-center">{t("reviews.date")}</TableHead>
                <TableHead className="text-center">
                  {t("reviews.title_table")}
                </TableHead>
                <TableHead className="text-center">
                  {t("reviews.description")}
                </TableHead>
                <TableHead className="text-center">{t("reviews.rating")}</TableHead>
                <TableHead className="text-right">
                  {t("reviews.actions")}{" "}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((review) => (
                <TableRow key={review.id} className="even:bg-gray-50">
                  <TableCell>{review.Product?.title}</TableCell>
                  <TableCell>{formatId(review.id)}</TableCell>
                  <TableCell className="text-center">
                    {formateDate(review.createdAt).substring(0, 17)}
                  </TableCell>
                  <TableCell className="text-center">{review.title}</TableCell>
                  <TableCell className="text-center">
                    {review.description}
                  </TableCell>
                  <TableCell className="text-center">{review.rate}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      onClick={() => deleteReviewHandler(review.id)}
                    >
                      {t("reviews.delete_text")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
      `${import.meta.env.VITE_BACKEND_URL}/reviews/${id}?language=${language}`,
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

ReviewsPage.action = action;
ReviewsPage.loader = loader;

export default ReviewsPage;
