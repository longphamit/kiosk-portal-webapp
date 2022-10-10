import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Provider } from "react-redux";
import store from "./@app/redux/stores";
import AppRouter from "./@app/routers/app-routers";
import { toast, ToastContainer } from "react-toastify";
import { I18nextProvider } from "react-i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import i18n from "./@app/configs/locales/i8n";
import messaging, {
  getTokenCustom,
  onMessageListener,
} from "./kiosk_portal/configs/firebase";
import { onMessage } from "firebase/messaging";
import { notification } from "antd";
import { SmileOutlined } from "@ant-design/icons";

function App() {
  const [isTokenFound, setTokenFound] = useState(false);
  onMessage(messaging, (payload) => {
    notification.open({
      message: payload.notification?.title,
      description: payload.notification?.body,
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  });
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
