import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import reducers from "./reducers"; // Ensure this is exporting a default combineReducers call
import App from "./App";
import "./index.css";

// Create a Redux store using Redux Toolkit
const store = configureStore({ 
  reducer: reducers, // This should be an object of reducers if you have multiple or a single reducer function
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), 
  devTools: process.env.NODE_ENV !== 'production', // Automatically use Redux DevTools in development
});

const root = ReactDOM.createRoot(document.getElementById("root")); // Create a root with createRoot

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
