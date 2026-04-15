import { configureStore, combineReducers } from "@reduxjs/toolkit";
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

import componentReducer from "./slices/component.slice";
import canvasReducer from "./slices/canvas.slice";
import themeReducer from "./slices/theme.slice";
import dataReducer from "./slices/data.slice";
import customComponentsReducer from "./slices/custom-components.slice";
import uiReducer from "./slices/ui.slice";
import historyReducer from "./slices/history.slice";

const rootReducer = combineReducers({
  component: componentReducer,
  canvas: canvasReducer,
  theme: themeReducer,
  data: dataReducer,
  customComponents: customComponentsReducer,
  ui: uiReducer,
  history: historyReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "component",
    "canvas",
    "theme",
    "data",
    "customComponents",
    "ui",
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
