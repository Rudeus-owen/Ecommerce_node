const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXa7o3j4Kpf3BER3liWCk8FGOI06-3Oig",
  authDomain: "ecommerce-image-79c5b.firebaseapp.com",
  projectId: "ecommerce-image-79c5b",
  storageBucket: "ecommerce-image-79c5b.appspot.com",
  messagingSenderId: "573689610375",
  appId: "1:573689610375:web:4be57e95b28881ea83b822",
  measurementId: "G-ERYVT9EC98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { storage };
