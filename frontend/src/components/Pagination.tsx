import { NavLink } from "react-router-dom";

const Pagination = ({
  pages,
  mode,
  params,
}: {
  pages: number;
  mode?: string;
  params?: {
    [k: string]: string;
  };
}) => {
  let link;
  switch (mode) {
    case "productsList":
      link = "admin/productsList/page";
      break;
    case "ordersList":
      link = "admin/ordersList/page";
      break;
    case "reviewsList":
      link = "admin/reviewsList/page";
      break;
    default:
      link = "page";
  }

  let content;

  if (!params || Object.keys(params).length === 0) {
    content = [...Array(pages).keys()].map((item) => (
      <NavLink to={`/${link}/${item + 1}`} key={item + 1}>
        <li className="px-4 py-2 ">{item + 1}</li>
      </NavLink>
    ));
  } else
    content = [...Array(pages).keys()].map((item) => (
      <NavLink
        to={`/${link}/${item + 1}?${new URLSearchParams(params)}`}
        key={item + 1}
      >
        <li className="px-4 py-2 ">{item + 1}</li>
      </NavLink>
    ));

  return (
    <ul className="inline-flex mt-5 border border-solid rounded-sm overflow-hidden divide divide-x">
      {content}
    </ul>
  );
};
export default Pagination;
