import dictionary, { type ObjectDict } from "@/dictionaries/dictionary";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Full } from "./Rating";
import { Link } from "react-router-dom";

const ratings = ["any", 4, 3, 2, 1];

const prices = ["any", "0-25", "25-50", "50-75", "75-100", "100-200"];

const CURRENCY = import.meta.env.VITE_CURRENCY;

const Filter = ({
  getFilterUrl,
  rating,
  price,
}: {
  getFilterUrl: ({
    o,
    c,
    r,
    p,
  }: {
    o?: string;
    c?: string;
    r?: string;
    p?: string;
  }) => string;
  rating: string;
  price: string;
}) => {
  const { customer_ratings, customer_ratingsPL, price_text, price_textPL } =
    dictionary.filterLinks as ObjectDict;

  const { language } = useSelector((state: RootState) => state.ui);

  return (
    <div className="flex flex-col space-y-12 ">
      <div className="space-y-2">
        <p className="font-semibold">
          {language === "en" ? customer_ratings : customer_ratingsPL}
        </p>
        {ratings.map((r, index) => (
          <Link
            to={getFilterUrl({ r: r.toString() })}
            key={index}
            className={`flex gap-2 ${
              rating === r.toString() && "font-semibold"
            } `}
          >
            {language !== "en" && r !== "any" && "min."}{" "}
            {language === "en" ? r : r === "any" ? "wszystkie" : r}{" "}
            {r !== "any" && <Full />}
            {language === "en" && r !== "any" && "& up"}
          </Link>
        ))}
      </div>
      <div className="space-y-2">
        <p className="font-semibold">
          {language === "en" ? price_text : price_textPL}
        </p>
        {prices.map((p, index) => (
          <Link
            key={index}
            to={getFilterUrl({ p })}
            className={`flex gap-2 ${price === p && "font-semibold"} `}
          >
            {CURRENCY === "us" && p !== "any" && "USD"}{" "}
            {language === "en" ? p : p === "any" ? "wszystkie" : p}{" "}
            {CURRENCY === "pln" && p !== "any" && "zł"}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Filter;
