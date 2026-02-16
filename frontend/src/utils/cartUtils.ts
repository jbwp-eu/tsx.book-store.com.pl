import { type CartState } from "@/store/cartSlice";

const TAX = import.meta.env.VITE_TAX;

// export const addDecimals = (num: number) => {
//   return Number((Math.round(num * 100) / 100).toFixed(2));
// };

// Round number to 2 decimal places
export function round2(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Value is not a number or string");
  }
}

export const updateCart = (state: CartState) => {
  state.itemsQuantity = state.cartItems.reduce((a, c) => a + c.quantity, 0);

  state.itemsPrice = round2(
    state.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  state.shippingPrice = round2(
    state.itemsPrice > 200 || state.itemsPrice === 0 ? 0 : 20
  );

  state.taxPrice = round2(TAX * state.itemsPrice);

  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
