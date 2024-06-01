import { useState, useEffect, useRef } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@lib/firebase";
import { number, z } from "zod";
import { countryList } from "@lib/countries";
import { phoneSchema } from "@lib/form-schema";

const PhoneAuth = () => {
  const [selectedCountry, setSelectedCountry] = useState(countryList[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const recaptchaRef = useRef(null);

  // useEffect(() => {
  //   loadRecaptcha();
  // }, []);

  const loadRecaptcha = async () => {
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "normal",
        callback: (response) => {
          console.log("reCAPTCHA solved", response);
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired");
        },
      });
      const confirmation = signInWithPhoneNumber(auth, phoneNumber, recaptcha);
      console.log("recaptcha", recaptcha, "confirmation", confirmation);
    } catch (error) {
      console.log("Error loading reCAPTCHA", error);
    }
  };

  const handleRecaptcha = async () => {
    const validatedFields = phoneSchema.safeParse({
      phone: phoneNumber,
    });
    console.log("handleGetOTP", validatedFields);
    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    try {
      setErrors({});
      const fullPhoneNumber = `+${selectedCountry.code}${phoneNumber}`;
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "normal",
        callback: (response) => {
          console.log("reCAPTCHA solved", response);
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired");
        },
      });
      const confirmationResult = signInWithPhoneNumber(
        auth,
        fullPhoneNumber,
        recaptcha
      );

      console.log("SMS sent", confirmationResult);
      setOtpSent(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {});
        setErrors(errorMessages);
      } else {
        setErrors({
          global: error.message || "Failed to send OTP. Please try again.",
        });
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    const nameSchema = z.string().min(1, { message: "Name is required" });
    const passwordSchema = z.string().min(6, { message: "Password too short" });

    try {
      nameSchema.parse(name);
      passwordSchema.parse(password);
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      console.log("All fields valid. Submit form.");
      // Add form submission logic here.
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {});
        setErrors(errorMessages);
      } else {
        setErrors({ global: error.message });
      }
    }
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
              <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded-lg">
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
                    onClick={() => setIsModalOpen(true)}
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
                {errors.phoneNumber && (
                  <p className="text-red-500 mt-2">{errors.phoneNumber}</p>
                )}
                {errors.global && (
                  <p className="text-red-500 mt-2">{errors.global}</p>
                )}
                {isModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-gray-800">
                    <div className="bg-white p-4 rounded-md shadow-lg max-w-lg w-full">
                      <h2 className="text-xl font-semibold mb-4">
                        Select Your Country
                      </h2>
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
                )}
              </div>
              <div
                id="recaptcha-container"
                ref={recaptchaRef}
                className="p-4"
              ></div>
              <div className="my-6">
                <button
                  type="button"
                  onClick={handleRecaptcha}
                  className="w-full text-center py-3 rounded bg-emerald-500 text-white hover:bg-emerald-600 transition-all focus:outline-none my-1"
                >
                  Login
                </button>
              </div>
              {otpSent && (
                <div className="max-w-md mx-auto mt-6 p-4 bg-white rounded-lg">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    className="block w-full rounded-md border border-gray-300 pl-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  {errors.otp && (
                    <p className="text-red-500 mt-2">{errors.otp}</p>
                  )}
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mt-4 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="block w-full rounded-md border border-gray-300 pl-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-red-500 mt-2">{errors.name}</p>
                  )}
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mt-4 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="block w-full rounded-md border border-gray-300 pl-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && (
                    <p className="text-red-500 mt-2">{errors.password}</p>
                  )}
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mt-4 mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="block w-full rounded-md border border-gray-300 pl-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 mt-2">
                      {errors.confirmPassword}
                    </p>
                  )}
                  <div className="my-6">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="w-full text-center py-3 rounded bg-emerald-500 text-white hover:bg-emerald-600 transition-all focus:outline-none my-1"
                    >
                      Submit
                    </button>
                  </div>
                  {errors.global && (
                    <p className="text-red-500 mt-2">{errors.global}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneAuth;
