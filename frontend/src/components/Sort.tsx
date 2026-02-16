import dictionary, { type ObjectDict } from "@/dictionaries/dictionary";

import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Link, useSearchParams } from "react-router-dom";
import type { SortProps } from "./Products";

const sortOrders = [
  { en: "ascending", pl: "rosnąco" },
  { en: "descending", pl: "malejąco" },
];

const sortCategory = [
  { en: "title", pl: "tytuł" },
  { en: "price", pl: "cena" },
  { en: "rating", pl: "ocena" },
];

const Sort = ({
  getFilterUrl,
  order,
  category,
}: // sortItems,
{
  getFilterUrl: ({ o, c }: { o?: string; c?: string }) => string;
  order: string;
  category: string;
  sortItems: (newParams: { [x: string]: string }) => void;
}) => {
  const {
    sort_text,
    sort_textPL,
    rating_text,
    rating_textPL,
    price_text,
    price_textPL,
    order_text,
    order_textPL,
    ascending,
    ascendingPL,
    descending,
    descendingPL,
    button_clear,
    button_clearPL,
  } = dictionary.sort as ObjectDict;

  const { language } = useSelector((state: RootState) => state.ui);

  const [searchParams, setSearchParams] = useSearchParams();

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: SortProps; value: string };
    const currentParams = Object.fromEntries([...searchParams]);
    const newParams = { ...currentParams, [name]: value };
    setSearchParams(newParams);
    // sortItems(newParams);
  };

  return (
    <>
      <div className="flex-column gap-2 hidden ">
        <p className="flex my-4 items-center gap-2 ">
          {language === "en" ? sort_text : sort_textPL}{" "}
          <Label htmlFor="rating">
            {language === "en" ? rating_text : rating_textPL}
          </Label>
          <Input
            id="rating"
            type="radio"
            name="category"
            value="rating"
            onChange={handleRatingChange}
            defaultChecked={searchParams.get("category") === "rating"}
            className="h-4 w-10 shadow-none "
          />
          <Label htmlFor="price">
            {language === "en" ? price_text : price_textPL}
          </Label>
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
          {language === "en" ? order_text : order_textPL}
          <Label htmlFor="ascending">
            {language === "en" ? ascending : ascendingPL}
          </Label>
          <Input
            id="ascending"
            type="radio"
            name="order"
            value="ascending"
            onChange={handleRatingChange}
            defaultChecked={searchParams.get("order") === "ascending"}
            className="h-4 w-10 shadow-none "
          />
          <Label htmlFor="descending">
            {language === "en" ? descending : descendingPL}
          </Label>
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
          <p className="font-semibold">
            {language === "en" ? sort_text : sort_textPL}
          </p>
          {sortOrders.map((o) => (
            <Link
              key={o.en}
              to={`${getFilterUrl({ o: o.en })}`}
              className={`${order === o.en && "font-semibold"}`}
            >
              {language === "en" ? o.en : o.pl}
            </Link>
          ))}
          {sortCategory.map((c) => (
            <Link
              key={c.en}
              to={`${getFilterUrl({ c: c.en })}`}
              className={`${category === c.en && "font-semibold"}`}
            >
              {language === "en" ? c.en : c.pl}
            </Link>
          ))}
        </div>
        <Link to="/" className="hover:underline font-semibold">
          {language === "en" ? button_clear : button_clearPL}
        </Link>
      </div>
    </>
  );
};

export default Sort;
