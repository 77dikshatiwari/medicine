import React, { useState } from "react";
import axios from "axios";
import Loader from "./Loader";

const commonMedicines = [
  "Paracetamol",
  "Ibuprofen",
  "Aspirin",
  "Amoxicillin",
  "Omeprazole",
];

const Suggestions = ({ onSuggestionClick }) => {
  const [loadingSuggestions, setLoadingSuggestions] = useState(null);
  const api_url = import.meta.env.VITE_API_URL;

  const handleSubmit = async (medicine) => {
    setLoadingSuggestions(medicine);
    try {
      const response = await axios.post(`${api_url}/ai/generate`, {
        medicineName: medicine,
      });
      const generatedContent = response.data.content;
      onSuggestionClick(medicine);
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const token = localStorage.getItem("token");
        if (token) {
          await axios.post(
            `${api_url}/suggestions`,
            { medicineName: medicine, content: generatedContent },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }
    } catch (error) {
      console.error(`Error fetching suggestions: ${error.message}`);
    } finally {
      setLoadingSuggestions(null);
    }
  };
  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 mb-5">
        {commonMedicines.map((medicine, index) => (
          <button
            key={index}
            onClick={() => handleSubmit(medicine)}
            className={`relative px-4 py-2 mt-4 text-lg bg-blue-500 text-white rounded-full shadow-lg transition-transform transform hover:bg-blue-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              loadingSuggestions === medicine ? "pointer-events-none" : ""
            }`}
            disabled={loadingSuggestions === medicine}
          >
            {medicine}
          </button>
        ))}
      </div>
      <Loader loading={loadingSuggestions !== null} />
    </>
  );
};

export default Suggestions;
