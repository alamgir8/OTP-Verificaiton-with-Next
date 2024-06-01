import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// export const firebaseConfig = {
//   apiKey: "AIzaSyC9zndHQm2MlE4-__JjWSc1dkIer4rkV0M",
//   authDomain: "kachabazar-45b5b.firebaseapp.com",
//   projectId: "kachabazar-45b5b",
//   storageBucket: "kachabazar-45b5b.appspot.com",
//   messagingSenderId: "293778758089",
//   appId: "1:293778758089:web:bb04a89fabb3f43ed03018",
// };
export const firebaseConfig = {
  apiKey: "AIzaSyAmqLcI0Ka6UHx_xu8HVWuk3e89sfqF1d0",
  authDomain: "verify-otp-df9ce.firebaseapp.com",
  projectId: "verify-otp-df9ce",
  storageBucket: "verify-otp-df9ce.appspot.com",
  messagingSenderId: "829737744550",
  appId: "1:829737744550:web:f1439f8aa1df111f489c67",
};

export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
