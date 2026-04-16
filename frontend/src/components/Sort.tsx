import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Link, useSearchParams } from "react-router-dom";
import type { SortProps } from "./Products";
import { useTranslation } from "react-i18next";

const sortOrders = [
  { value: "ascending", labelKey: "sort.ascending" as const },
  { value: "descending", labelKey: "sort.descending" as const },
];

const sortCategory = [
  { value: "title", labelKey: "sort.category_title" as const },
  { value: "price", labelKey: "sort.category_price" as const },
  { value: "rating", labelKey: "sort.category_rating" as const },
];

const Sort = ({
  getFilterUrl,
  order,
  category,
}: {
  getFilterUrl: ({ o, c }: { o?: string; c?: string }) => string;
  order: string;
  category: string;
  sortItems: (newParams: { [x: string]: string }) => void;
}) => {
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: SortProps; value: string };
    const currentParams = Object.fromEntries([...searchParams]);
    const newParams = { ...currentParams, [name]: value };
    setSearchParams(newParams);
  };

  return (
    <>
      <div className="flex-column gap-2 hidden ">
        <p className="flex my-4 items-center gap-2 ">
          {t("sort.sort_text")}{" "}
          <Label htmlFor="rating">{t("sort.rating_text")}</Label>
          <Input
            id="rating"
            type="radio"
            name="category"
            value="rating"
            onChange={handleRatingChange}
            defaultChecked={searchParams.get("category") === "rating"}
            className="h-4 w-10 shadow-none "
          />
          <Label htmlFor="price">{t("sort.price_text")}</Label>
          <Input
            id="price"
            type="radio"
            name="category"
            value="price"
            onChange={handleRatingChange}
            defaultChecked={searchParams.get("category") === "price"}
            className="h-4 w-10 shadow-none "
          />
        </p>
        <p className="flex my-4 items-center gap-2 ">
          {t("sort.order_text")}
          <Label htmlFor="ascending">{t("sort.ascending")}</Label>
          <Input
            id="ascending"
            type="radio"
            name="order"
            value="ascending"
            onChange={handleRatingChange}
            defaultChecked={searchParams.get("order") === "ascending"}
            className="h-4 w-10 shadow-none "
          />
          <Label htmlFor="descending">{t("sort.descending")}</Label>
          <Input
            id="descending"
            type="radio"
            name="order"
            value="descending"
            onChange={handleRatingChange}
            defaultChecked={searchParams.get("order") === "descending"}
            className="h-4 w-10 shadow-none "
          />
        </p>
      </div>

      <div className="flex flex-row justify-between items-center flex-wrap mb-4 ">
        <div className="flex flex-wrap gap-x-3">
          <p className="font-semibold">{t("sort.sort_text")}</p>
          {sortOrders.map((o) => (
            <Link
              key={o.value}
              to={`${getFilterUrl({ o: o.value })}`}
              className={`${order === o.value && "font-semibold"}`}
            >
              {t(o.labelKey)}
            </Link>
          ))}
          {sortCategory.map((c) => (
            <Link
              key={c.value}
              to={`${getFilterUrl({ c: c.value })}`}
              className={`${category === c.value && "font-semibold"}`}
            >
              {t(c.labelKey)}
            </Link>
          ))}
        </div>
        <Link to="/" className="hover:underline font-semibold">
          {t("sort.button_clear")}
        </Link>
      </div>
    </>
  );
};

export default Sort;
