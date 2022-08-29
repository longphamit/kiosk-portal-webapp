// Import the functions you need from the SDKs you need
import firebase, { initializeApp } from "firebase/app";
import "@firebase/messaging";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBC_Q1n9Veg-TcTu6FVC0ZEQY5-Gy8z9X0",
  authDomain: "kiosk-solution.firebaseapp.com",
  projectId: "kiosk-solution",
  storageBucket: "kiosk-solution.appspot.com",
  messagingSenderId: "890619537100",
  appId: "1:890619537100:web:ebe0f1b0c9e1e65a690469",
  measurementId: "G-D7H3G6RXGL",
};
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
export const getTokenCustom = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BIGqSN2lD1ZpMXdzen4ZcE3zyqCWeuHmV_HFzdDLW-WZQcdm00zRe8DUNTlvtJE0JU68HBcQxb7g9xZ0StEy9KI",
    });
    return currentToken
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
      return payload
    });
});
export default messaging;