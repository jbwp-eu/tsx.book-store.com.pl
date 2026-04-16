import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Calendar, User } from "lucide-react";
import Rating from "./Rating";
import ReviewForm from "./ReviewForm";
import type { Product } from "@/types";
import type { RootState } from "@/store/store";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { useTranslation } from "react-i18next";

const ReviewList = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const { name, email } = useAppSelector(
    (state: RootState) => state.auth.userInfo
  );
  const date = new Date().toLocaleString();

  return (
    <div>
      {name && email ? (
        <ReviewForm />
      ) : (
        <p className="mt-4 mb-8 text-xl font-normal ">
          {t("reviewList.invite_prefix")}
          <Link
            to={`/login?redirect=/product/${product.id}`}
            className="font-normal underline decoration-solid"
          >
            {t("reviewList.signIn")}
          </Link>{" "}
          {t("reviewList.message_text")}
        </p>
      )}
      <div className="flex flex-col gap-3">
        {product.ProductReviews?.map((review) => (
          <Card key={review.id} className="text-card-foreground/75 max-w-xl">
            <CardHeader>
              <CardTitle className="text-lg">{review.title}</CardTitle>
              <CardDescription>{review.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <Rating value={review.rate} />
                <div className="flex items-center">
                  <User /> {review.userName}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1" />
                  {date}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
