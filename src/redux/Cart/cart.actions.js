import cartTypes from "./cart.type";

export const addProduct = (nextCartItem) => ({
  type: cartTypes.ADD_TO_CART,
  payload: nextCartItem,
});

export const removerCartItem = (cartItem) => ({
  type: cartTypes.REMOVE_CART_ITEM,
  payload: cartItem,
});

export const reduceCartItem = (cartItem) => ({
  type: cartTypes.REDUCE_CART_ITEM,
  payload: cartItem,
});

export const clearCart = () => ({
  type: cartTypes.CLEAR_CART,
});
