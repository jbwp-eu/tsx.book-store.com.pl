import dictionary, { type ObjectDict } from "@/dictionaries/dictionary";

const {
  products,
  productsPL,
  orders,
  ordersPL,
  users,
  usersPL,
  reviews,
  reviewsPL,
  overview,
  overviewPL,
} = dictionary.navigation as ObjectDict;

const links = [
  {
    href: "/admin/overview",
    title: overview,
    titlePL: overviewPL,
  },
  {
    href: "/admin/productsList",
    title: products,
    titlePL: productsPL,
  },
  {
    href: "/admin/ordersList",
    title: orders,
    titlePL: ordersPL,
  },
  {
    href: "/admin/usersList",
    title: users,
    titlePL: usersPL,
  },
  {
    href: "/admin/reviewsList",
    title: reviews,
    titlePL: reviewsPL,
  },
];

export default links;
