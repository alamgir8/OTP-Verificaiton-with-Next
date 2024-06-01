// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9zndHQm2MlE4-__JjWSc1dkIer4rkV0M",
  authDomain: "kachabazar-45b5b.firebaseapp.com",
  projectId: "kachabazar-45b5b",
  storageBucket: "kachabazar-45b5b.appspot.com",
  messagingSenderId: "293778758089",
  appId: "1:293778758089:web:bb04a89fabb3f43ed03018",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
