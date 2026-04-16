import { Full } from "./Rating";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  return (
    <div className="flex flex-col space-y-12 ">
      <div className="space-y-2">
        <p className="font-semibold">{t("filterLinks.customer_ratings")}</p>
        {ratings.map((r, index) => (
          <Link
            to={getFilterUrl({ r: r.toString() })}
            key={index}
            className={`flex gap-2 ${
              rating === r.toString() && "font-semibold"
            } `}
          >
            {!isEn && r !== "any" && t("filter.min_prefix")}{" "}
            {r === "any" ? t("filter.rating_any") : r}{" "}
            {r !== "any" && <Full />}
            {isEn && r !== "any" && t("filter.and_up")}
          </Link>
        ))}
      </div>
      <div className="space-y-2">
        <p className="font-semibold">{t("filterLinks.price_text")}</p>
        {prices.map((p, index) => (
          <Link
            key={index}
            to={getFilterUrl({ p })}
            className={`flex gap-2 ${price === p && "font-semibold"} `}
          >
            {CURRENCY === "us" && p !== "any" && "USD"}{" "}
            {p === "any" ? t("filter.price_any") : p}{" "}
            {CURRENCY === "pln" && p !== "any" && "zł"}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Filter;
