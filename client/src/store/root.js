import { combineReducers, createStore } from "redux";
import { appReducer } from "./app";
import { userReducer } from "./user";
import { mapReducer } from "./map";
import { toastsReducer } from "./toast";

export const rootReducer = combineReducers({
  user: userReducer,
  app: appReducer,
  map: mapReducer,
  toasts: toastsReducer,
});

export const store = createStore(rootReducer);
