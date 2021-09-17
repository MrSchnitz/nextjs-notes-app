import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import rootSaga, { mainReducers } from "./RootState";
import createSagaMiddleware from "redux-saga";
import {useMemo} from "react";

let store: any;

function configureAppStore() {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);

  // Create the store with saga middleware and router middleware
  const middlewares = [sagaMiddleware];

  const store = configureStore({
    reducer: combineReducers({ ...mainReducers }),
    middleware: [...getDefaultMiddleware(), ...middlewares],
    devTools: process.env.NODE_ENV !== "production",
  });

  // Add all combined Sagas to middleware
  sagaMiddleware.run(rootSaga);

  return store;
}

export const initializeStore = () => {
  let _store = store ?? configureAppStore();
  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export const useStore = () => useMemo(() => initializeStore(),[]);
