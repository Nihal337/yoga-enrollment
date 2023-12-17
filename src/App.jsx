import React, { useState } from "react";
import axios from "axios";

function AdmissionForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [batch, setBatch] = useState("");
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setPaymentStatus(null);
    const userData = { name, age, batch };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/submit",
        userData
      );
      if (response.data.paymentResult.success) {
        setPaymentStatus("Payment successful");
      } else {
        setPaymentStatus("Payment failed");
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Error submitting form");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md px-8 py-6 space-y-6 bg-white rounded shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Admission Form
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        {paymentStatus && <p className="text-green-500">{paymentStatus}</p>}
        <div className="flex flex-wrap">
          <label className="block w-full">
            <span className="text-gray-700">Name:</span>
            <input
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="flex flex-wrap">
          <label className="block w-full">
            <span className="text-gray-700">Age:</span>
            <input
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="number"
              value={age}
              min="18"
              max="65"
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="flex flex-wrap">
          <label className="block w-full">
            <span className="text-gray-700">Batch:</span>
            <select
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              required
            >
              <option value="">Select...</option>
              <option value="6-7AM">6-7AM</option>
              <option value="7-8AM">7-8AM</option>
              <option value="8-9AM">8-9AM</option>
              <option value="5-6PM">5-6PM</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap">
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdmissionForm;
