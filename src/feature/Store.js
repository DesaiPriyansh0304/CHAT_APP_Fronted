import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
//all Slice import
import rootReducer from "./Slice/index";

//store value
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth", "AuthUser", "theme"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

//create in store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Export both store and persistor
export const persistor = persistStore(store);
export default store;
