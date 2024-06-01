import { initializeApp } from "firebase/app";
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

export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
