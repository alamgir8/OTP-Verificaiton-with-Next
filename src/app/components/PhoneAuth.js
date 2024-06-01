import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { countryList } from "../lib/countries";

const PhoneAuth = () => {
  const [selectedCountry, setSelectedCountry] = useState(countryList[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadRecapthca = () => {
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "normal",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
        },
        "expired-callback": () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleRecapthca = async () => {
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "normal",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
        },
        "expired-callback": () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
        },
      });
      const user = signInWithPhoneNumber(auth, phoneNumber, recaptcha);
    } catch (error) {
      console.log("error", error);
    }
  };

  const Modal = ({ isOpen, closeModal, setSelectedCountry }) => {
    return (
      isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Select Your Country</h2>
            <ul className="max-h-60 overflow-y-auto">
              {countryList.map((country) => (
                <li
                  key={country.name}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedCountry(country);
                    closeModal();
                  }}
                >
                  {country.flag} {country.name} (+{country.code})
                </li>
              ))}
            </ul>
            <button
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )
    );
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
      <div className="py-4 flex flex-col lg:flex-row w-full">
        <div className="w-full sm:p-5 lg:p-8">
          <div className="mx-auto text-left justify-center rounded-md w-full max-w-lg px-4 py-8 sm:p-10 overflow-hidden align-middle transition-all transform bg-white shadow-xl rounded-2x">
            <div className="overflow-hidden mx-auto">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-1">
                  Welcome to Fably Store
                </h2>
                <p className="text-sm text-gray-600 mt-1 mb-6">
                  Get started - it's free.
                </p>
              </div>
              <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded-lg shadow-md">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    className="flex items-center justify-center w-1/3 rounded-l-md border border-gray-300 bg-gray-100 py-2 px-3 focus:outline-none"
                    onClick={() => {
                      setIsModalOpen(true);
                      loadRecapthca();
                    }}
                  >
                    {selectedCountry.flag} +{selectedCountry.code}
                  </button>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="block w-2/3 rounded-r-md border border-gray-300 pl-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <Modal
                  isOpen={isModalOpen}
                  closeModal={() => setIsModalOpen(false)}
                  setSelectedCountry={setSelectedCountry}
                />
              </div>
              <div id="recaptcha-container" className="p-4"></div>
              <div className="my-6">
                <button
                  type="button"
                  onClick={handleRecapthca}
                  className="w-full text-center py-3 rounded bg-emerald-500 text-white hover:bg-emerald-600 transition-all focus:outline-none my-1"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneAuth;
