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
import dictionary, { type ObjectDict } from "@/dictionaries/dictionary";
import { useAppSelector } from "@/store/hook";
import type { RootState } from "@/store/store";
import type { MessageProps, ProductReview } from "@/types";
import { formateDate, formatId } from "@/utils/formatUtils";
import {
  useLoaderData,
  useSubmit,
  type ActionFunctionArgs,
  type LoaderFunction,
} from "react-router-dom";
import { toast } from "sonner";

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
      // throw new Error(resData.message);
      toast.error(resData.message);
      return resData;
    } else {
      return response;
    }
  };

const ReviewsPage = () => {
  const data = useLoaderData<ProductReview[] | MessageProps>();
  const submit = useSubmit();
  const { language } = useAppSelector((state: RootState) => state.ui);

  const {
    id,
    idPL,
    productTitle,
    productTitlePL,
    date,
    datePL,
    title,
    titlePL,
    title_table,
    title_tablePL,
    description,
    descriptionPL,
    rating,
    ratingPL,
    actions,
    actionsPL,
    delete_text,
    delete_textPL,
  } = dictionary.reviews as ObjectDict;

  function deleteReviewHandler(id: string) {
    submit({ id }, { method: "delete", encType: "application/json" });
  }

  let content;

  if ("message" in data) {
    content = <Message info>{data.message}</Message>;
  } else {
    content = (
      <div>
        <h2 className="h2-semibold py-4">
          {language === "en" ? title : titlePL}
        </h2>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {language === "en" ? productTitle : productTitlePL}
                </TableHead>
                <TableHead>{language === "en" ? id : idPL}</TableHead>
                <TableHead className="text-center">
                  {language === "en" ? date : datePL}
                </TableHead>
                <TableHead className="text-center">
                  {language === "en" ? title_table : title_tablePL}
                </TableHead>
                <TableHead className="text-center">
                  {language === "en" ? description : descriptionPL}
                </TableHead>
                <TableHead className="text-center">
                  {language === "en" ? rating : ratingPL}
                </TableHead>
                <TableHead className="text-right">
                  {language === "en" ? actions : actionsPL}{" "}
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
                      {language === "en" ? delete_text : delete_textPL}
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
