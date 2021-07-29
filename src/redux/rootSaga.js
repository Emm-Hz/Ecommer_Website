import { all, call } from "redux-saga/effects";
import userSagas from "./user/user.sagas";
import productsSaga from "./Products/products.saga";
import ordersSagas from "./Orders/orders.saga";

export default function* rootSaga() {
  yield all([call(userSagas), call(productsSaga), call(ordersSagas)]);
}
