import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Provider } from "react-redux";
import store from "./@app/redux/stores";
import AppRouter from "./@app/routers/app-routers";
import { ToastContainer } from "react-toastify";
import { I18nextProvider } from "react-i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import i18n from "./@app/configs/locales/i8n";

function App() {
  
  
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <AppRouter />
        <ToastContainer position="top-right" autoClose={3000} />
      </I18nextProvider>
    </Provider>
  );
}

export default App;
