import dictionary, { type ObjectDict } from "@/dictionaries/dictionary";
import { useAppSelector } from "@/store/hook";
import type { RootState } from "@/store/store";
import type { Product } from "@/types";
import { useCallback, useContext, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import Sort from "./Sort";
import { useParams, useSearchParams } from "react-router-dom";
import Filter from "./Filter";
import FilterContextProvider from "./StateContext";

export type SortProps = "price" | "rating" | "title";

// type Rating = "any" | "1" | "2" | "3" | "4";
// type Price = "any" | "1-25" | "26-50" | "51-75" | "76-100" | "101-1000";

// const FILTER_MAP = {
//   any: () => true,
//   "1": (item: Product) => item.rating >= 1,
//   "2": (item: Product) => item.rating >= 2,
//   "3": (item: Product) => item.rating >= 3,
//   "4": (item: Product) => item.rating >= 4,
//   "1-25": (item: Product) => item.price <= 25,
//   "26-50": (item: Product) => item.price > 25 && item.price <= 50,
//   "51-75": (item: Product) => item.price > 50 && item.price <= 75,
//   "76-100": (item: Product) => item.price > 75 && item.price <= 100,
//   "101-1000": (item: Product) => item.price > 100,
// };

const Products = ({
  products,
  pages,
}: {
  products: Product[];
  pages: number;
}) => {
  // const [items, setItems] = useState<Product[]>([]);

  const { isFilter } = useContext(FilterContextProvider.Context);

  const [params, setParams] = useState<{
    [k: string]: string;
  }>({});

  const [searchParams] = useSearchParams();

  const { pageNumber } = useParams();

  const { language } = useAppSelector((state: RootState) => state.ui);

  const { titlePL, title } = dictionary.home as ObjectDict;

  const sortItems = useCallback(
    (params: { [x: string]: string }) => {
      if (Object.keys(params).length === 0) {
        // setItems(products);
        return;
      }

      const sorted = [...products].sort((a, b) => {
        const { category, order } = params as {
          category: SortProps;
          order: string;
        };

        switch (order) {
          case "ascending": {
            return a[category] > b[category] ? 1 : -1;
          }
          case "descending": {
            return a[category] < b[category] ? 1 : -1;
          }
          default: {
            return a[category] > b[category] ? 1 : -1;
          }
        }
      });
      console.log(sorted);
      // setItems(sorted);
    },
    [products]
  );

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setParams(params);
    // sortItems(params);
  }, [sortItems, searchParams]);

  const getFilterUrl = ({
    o,
    c,
    r,
    p,
  }: {
    o?: string;
    c?: string;
    r?: string;
    p?: string;
  }) => {
    let newParams;
    if (o) {
      newParams = { category: "title", ...params, order: o };
    } else if (c) {
      newParams = { order: "ascending", ...params, category: c };
    } else if (r) {
      newParams = {
        order: "ascending",
        ...params,
        category: "rating",
        rating: r,
      };
    } else if (p) {
      newParams = {
        order: "ascending",
        ...params,
        category: "price",
        price: p,
      };
    } else newParams = { ...params };

    return pageNumber
      ? `/page/${pageNumber}?${new URLSearchParams(newParams)}`
      : `/?${new URLSearchParams(newParams)}`;
  };

  // function productsList() {
  //   const { rating = "any" } = params as { rating: Rating };
  //   const { price = "any" } = params as { price: Price };

  //   const filteredByRatingItems = items.filter(FILTER_MAP[rating]);
  //   const filteredByRatingAndPriceItems = filteredByRatingItems.filter(
  //     FILTER_MAP[price]
  //   );

  //   const products = filteredByRatingAndPriceItems?.map((product: Product) => (
  //     <ProductCard key={product.id} product={product} />
  //   ));

  //   return products;
  // }

  return (
    <div>
      <h1 className="h3-bold mb-6"> {language === "pl" ? titlePL : title}</h1>
      {/* <h2 className="bg-pink-500  xs:bg-red-500 sm:bg-green-500 md:bg-blue-500 lg:bg-amber-500 mb-2 xl:bg-black">
        Test
      </h2> */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
        {isFilter && (
          <Filter
            getFilterUrl={getFilterUrl}
            rating={params.rating}
            price={params.price}
          />
        )}

        <div
          className={`${
            isFilter
              ? "xs:col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4"
              : "col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5"
          }`}
        >
          {isFilter && (
            <Sort
              getFilterUrl={getFilterUrl}
              order={params.order || ""}
              category={params.category}
              sortItems={sortItems}
            />
          )}
          <div
            className={`${
              isFilter
                ? "xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 "
                : "xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            } grid gap-4 `}
          >
            {/* {productsList()} */}
            {/* {items.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))} */}
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
      <Pagination pages={pages} params={params} />
    </div>
  );
};

export default Products;
