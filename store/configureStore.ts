import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import rootSaga, { mainReducers } from "./RootState";
import createSagaMiddleware from "redux-saga";

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

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  // if (preloadedState && store) {
    // _store = configureAppStore({
    //   ...store.getState(),
    //   ...preloadedState,
    // })
    // Reset the current store
  //   store = undefined;
  // }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

// export function useStore(initialState) {
//   const store = useMemo(() => initializeStore(initialState), [initialState])
//   return store
// }
