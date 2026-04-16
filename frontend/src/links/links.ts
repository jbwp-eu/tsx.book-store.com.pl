export type AdminNavLink = { href: string; titleKey: string };

const adminNavLinks: AdminNavLink[] = [
  { href: "/admin/overview", titleKey: "navigation.overview" },
  { href: "/admin/productsList", titleKey: "navigation.products" },
  { href: "/admin/ordersList", titleKey: "navigation.orders" },
  { href: "/admin/usersList", titleKey: "navigation.users" },
  { href: "/admin/reviewsList", titleKey: "navigation.reviews" },
];

export default adminNavLinks;
