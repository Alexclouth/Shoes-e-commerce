import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyAwz3R-rGefOkOm0coKPFyC5aq3ec4jrjE",
  authDomain: "golden-strides.firebaseapp.com",
  projectId: "golden-strides",
  storageBucket: "golden-strides.firebasestorage.app",
  messagingSenderId: "635496335369",
  appId: "1:635496335369:web:fe9dca1d0165397c8390d8",
  measurementId: "G-GQEXD1E7E6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export { auth, db };