import React from "react";
import { FirebaseProvider } from "./context/FirebaseContext";

const Providers = ({ children }) => {
  return <FirebaseProvider>{children}</FirebaseProvider>;
};

export default Providers;
