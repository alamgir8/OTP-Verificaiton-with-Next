import { countryList } from "@lib/countries";
import React, { useEffect, useRef } from "react";

function Modal({ isOpen, closeModal, setSelectedCountry }) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div
          ref={modalRef}
          className="bg-white p-4 rounded-md shadow-lg max-w-lg w-full"
        >
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
}

export default Modal;
