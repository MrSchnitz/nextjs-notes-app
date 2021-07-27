import {Action, ThunkAction} from "@reduxjs/toolkit";
import {LoginApiInterface, LoginApiReducer, LoginApiSaga,} from "../pages/login/api/LoginAPI";
import {all} from "redux-saga/effects"

export interface RootState {
  // API
  loginApiSlice?: LoginApiInterface;
}

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export const mainReducers = {
  // API
  loginApiSlice: LoginApiReducer,
};

/**
 * IMPORT EVERY OTHER NOT SOMEWHERE ELSE INJECTED SAGA
 */
export default function* rootSaga() {
  yield all([LoginApiSaga()]);
}
