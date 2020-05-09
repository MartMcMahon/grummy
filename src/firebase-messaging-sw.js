importScripts('https://www.gstatic.com/firebasejs/7.12.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.12.0/firebase-messaging.js');

var firebaseConfig = {
  apiKey: "AIzaSyAE-tOOF1Igf94GlYmx70-whkc1KtD6RK0",
  authDomain: "grummy-4db97.firebaseapp.com",
  databaseURL: "https://grummy-4db97.firebaseio.com",
  projectId: "grummy-4db97",
  storageBucket: "grummy-4db97.appspot.com",
  messagingSenderId: "771629614773",
  appId: "1:771629614773:web:53279d0feab0b55234a0fc",
  measurementId: "G-1MFHJVG07L"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(payload => {
  const title = "hello worldd.";
  const options = {
    body: payload.data.status,
  };
  return self.registration.showNotification(title, options);
});
