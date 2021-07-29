import { takeLatest, all, call, put } from "@redux-saga/core/effects";
import {
  handleAddProduct,
  handleFetchProducts,
  handleDeleteProduct,
  handleFetchProduct,
  handleFetchHomeProducts,
} from "./products.helper";
import { setProducts, fetchProductsStart, setProduct } from "./products.action";
import { auth } from "../../firebase/utils";
import productsTypes from "./products.types";

export function* addProduct({ payload }) {
  try {
    const timestamp = new Date();
    yield handleAddProduct({
      ...payload,
      productAdminUserUID: auth.currentUser.uid,
      createdDate: timestamp,
    });

    yield put(fetchProductsStart());
  } catch (error) {
    // console.log(error)
  }
}

export function* onAddProductStart() {
  yield takeLatest(productsTypes.ADD_NEW_PRODUCT_START, addProduct);
}

export function* fetchProduct({ payload }) {
  try {
    const products = yield handleFetchProducts(payload);
    yield put(setProducts(products));
  } catch (error) {
    // console.log(error);
  }
}

export function* onFetchProductsStart() {
  yield takeLatest(productsTypes.FETCH_PRODUCTS_START, fetchProduct);
}

export function* deleteProduct({ payload }) {
  try {
    yield handleDeleteProduct(payload);
    yield put(fetchProductsStart());
  } catch (error) {
    // console.log(error);
  }
}

export function* onDeleteProductStart() {
  yield takeLatest(productsTypes.DELETE_PRODUCTS_START, deleteProduct);
}

export function* fetchProducts({ payload }) {
  try {
    const product = yield handleFetchProduct(payload);
    yield put(setProduct(product));
  } catch (error) {
    // console.log(error);
  }
}

export function* onFetchProductStart() {
  yield takeLatest(productsTypes.FETCH_PRODUCT_START, fetchProducts);
}

export function* fetchHomeProduct({ payload }) {
  try {
    const product = yield handleFetchHomeProducts(payload);
    yield put(setProduct(product));
  } catch (error) {
    // console.log(error);
  }
}

export function* onFetchHomeProductStart() {
  yield takeLatest(productsTypes.HOMEPAGE_PRODUCT_START, fetchHomeProduct);
}

export default function* productsSaga() {
  yield all([
    call(onAddProductStart),
    call(onFetchProductsStart),
    call(onDeleteProductStart),
    call(onFetchProductStart),
    call(onFetchHomeProductStart),
  ]);
}
