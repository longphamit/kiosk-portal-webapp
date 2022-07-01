// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.9.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.9.0/firebase-analytics.js");
importScripts("https://www.gstatic.com/firebasejs/8.9.0/firebase-messaging.js");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../firebase-messaging-sw.js")
    .then(function (registration) {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch(function (err) {
      console.log("Service worker registration failed, error:", err);
    });
}

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  messagingSenderId: "890619537100",
  appId: "1:890619537100:web:ebe0f1b0c9e1e65a690469",
};

// phần firebaseConfig tương tự như ở trên nhé

firebase.initializeApp(firebaseConfig);
