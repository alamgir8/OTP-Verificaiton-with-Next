import { useState, useEffect, useRef } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@lib/firebase";
import { countryList } from "@lib/countries";
import { phoneSchema, phoneSignUpSchema } from "@lib/form-schema";
import Error from "./Error";
import { notifySuccess } from "@lib/toast";

const PhoneCustomAuth = () => {
  const [selectedCountry, setSelectedCountry] = useState(countryList[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSentOtp = async () => {
    const validatedFields = phoneSchema.safeParse({
      phone: phoneNumber,
    });
    console.log("handleGetOTP", validatedFields);
    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      return setErrors(validatedFields.error.flatten().fieldErrors);
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
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        fullPhoneNumber,
        recaptcha
      );

      console.log("SMS sent", confirmationResult);
      notifySuccess("Otp sent successfully, please check your number");

      setOtpSent(true);
    } catch (error) {
      console.log("error", error);
      setErrors({
        global: error.message || "Failed to send OTP. Please try again.",
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    const validatedFields = phoneSignUpSchema.safeParse({
      name: name,
      password: password,
    });
    console.log("handleGetOTP", validatedFields);
    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      return setErrors(validatedFields.error.flatten().fieldErrors);
    }

    try {
      if (password !== confirmPassword) {
        return setErrors({
          confirmPassword: "Password not matched!",
        });
      }

      console.log("All fields valid. Submit form.");
      // Add form submission logic here.
    } catch (error) {
      setErrors({ global: error.message });
    }
  };

  console.log("errors", errors);

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
                {errors.phone && <Error errors={errors?.phone} />}
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

              <div className="my-6">
                <button
                  type="button"
                  onClick={handleSentOtp}
                  className="w-full text-center py-3 rounded bg-emerald-500 text-white hover:bg-emerald-600 transition-all focus:outline-none my-1"
                >
                  Sent OTP
                </button>
              </div>
              <div id="recaptcha-container" className="p-4"></div>
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
                  {errors?.password && <Error errors={errors?.password} />}
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

export default PhoneCustomAuth;
