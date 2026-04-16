import Message from "@/components/Message";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DataReviews, MessageProps } from "@/types";
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
  async ({ params }) => {
    const token = localStorage.getItem("token");
    const { pageNumber } = params;
    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/reviews/?pageNumber=${pageNumber}&language=${language}`,
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

const ReviewsListPage = () => {
  const { t } = useTranslation();
  const data = useLoaderData<DataReviews | MessageProps>();

  const submit = useSubmit();

  function deleteReviewHandler(id: string) {
    submit({ id }, { method: "delete", encType: "application/json" });
  }

  let content;

  if ("message" in data) {
    content = <Message info>{data.message}</Message>;
  } else {
    const { pages, reviews } = data;

    content = (
      <div>
        <h2 className="h2-semibold py-4">{t("reviewsList.title")}</h2>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("reviewsList.user")}</TableHead>
                <TableHead>{t("reviewsList.productTitle")}</TableHead>
                <TableHead>{t("reviewsList.id")}</TableHead>
                <TableHead className="text-center">
                  {t("reviewsList.date")}
                </TableHead>
                <TableHead className="text-center">
                  {t("reviewsList.title_table")}
                </TableHead>
                <TableHead className="text-center">
                  {t("reviewsList.description")}
                </TableHead>
                <TableHead className="text-center">
                  {t("reviewsList.rating")}
                </TableHead>
                <TableHead className="text-right">
                  {t("reviewsList.actions")}{" "}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id} className="even:bg-gray-50">
                  <TableCell>{review.User?.name}</TableCell>
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
                      {t("reviewsList.delete_text")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination pages={pages} mode="reviewsList" />
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

ReviewsListPage.loader = loader;
ReviewsListPage.action = action;

export default ReviewsListPage;
