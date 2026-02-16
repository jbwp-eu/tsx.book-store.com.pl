import { updateCart } from "@/utils/cartUtils";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: string;
  title: string;
  images: string[];
  price: number;
  quantity: number;
  countInStock: number;
};

export type ShippingAddress = {
  address: string;
  city: string;
  code: string;
  country?: string;
};

export type CartState = {
  cartItems: CartItem[];
  itemsQuantity: number;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: string;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
};

const initialState: CartState = {
  cartItems: [],
  itemsQuantity: 0,
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: "",
  shippingAddress: { address: "", city: "", code: "", country: "Polska" },
  paymentMethod: "",
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (
      state,
      action: PayloadAction<{
        id: string;
        title: string;
        images: string[];
        price: number;
        countInStock: number;
      }>
    ) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (itemIndex >= 0) {
        state.cartItems[itemIndex].quantity++;
      } else {
        state.cartItems = [
          ...state.cartItems,
          { ...action.payload, quantity: 1 },
        ];
      }
      return updateCart(state);
    },
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload
      );

      if (state.cartItems[itemIndex].quantity === 1) {
        state.cartItems.splice(itemIndex, 1);
      } else {
        state.cartItems[itemIndex].quantity--;
      }
      return updateCart(state);
    },
    saveShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      return updateCart(state);
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;
