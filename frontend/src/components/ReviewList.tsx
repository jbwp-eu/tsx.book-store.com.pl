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
import dictionary, { type ObjectDict } from "../dictionaries/dictionary.ts";
import { useAppSelector } from "@/store/hook";

const ReviewList = ({ product }: { product: Product }) => {
  const { name, email } = useAppSelector(
    (state: RootState) => state.auth.userInfo
  );
  const { language } = useAppSelector((state: RootState) => state.ui);
  const date = new Date().toLocaleString();
  const { signIn, signInPL, message_text, message_textPL } =
    dictionary.reviewList as ObjectDict;

  return (
    <div>
      {name && email ? (
        <ReviewForm />
      ) : (
        <p className="mt-4 mb-8 text-xl font-normal ">
          {language === "en" ? "Please " : ""}
          <Link
            to={`/login?redirect=/product/${product.id}`}
            className="font-normal underline decoration-solid"
          >
            {language === "en" ? signIn : signInPL}
          </Link>{" "}
          {language === "en" ? message_text : message_textPL}
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
