import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import reducers from "./reducers";
// import thunk from "redux-thunk"; // Ensure this is exporting a default combineReducers call
import App from "./App";
import "./index.css";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

// Create a Redux store using Redux Toolkit
const store = configureStore({
  reducer: reducers, // This should be an object of reducers if you have multiple or a single reducer function
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== "production", // Automatically use Redux DevTools in development
});

// const store = configureStore({
//   reducer: reducers,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(thunk),
//   devTools: process.env.NODE_ENV !== "production",
// });

const root = ReactDOM.createRoot(document.getElementById("root")); // Create a root with createRoot

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <App />
        </Provider>
      </I18nextProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// Register the service worker for PWA functionality
serviceWorkerRegistration.register();
