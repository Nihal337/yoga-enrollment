import React, { useState } from "react";
import axios from "axios";

function AdmissionForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [batch, setBatch] = useState("");
  const [paid, setPaid] = useState(false);
  const [enrollDate, setEnrollDate] = useState("");
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (age < 18 || age > 65) {
      setError("Age should be between 18 and 65");
      return;
    }

    setError(null);
    setPaymentStatus(null);

    const userData = { name, age, batch, paid, enrollDate };

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
      setError(
        error.response && error.response.data.error
          ? error.response.data.error
          : "Error submitting form"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md px-8 py-6 space-y-6 bg-white rounded shadow-2xl"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Admission Form for Yoga Classes
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        {paymentStatus && <p className="text-green-500">{paymentStatus}</p>}
        <div className="flex flex-wrap">
          <label className="block w-full">
            <span className="text-gray-700">Name:</span>
            <input
              className="w-full px-4 py-2 mt-2 border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
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
              className="w-full px-4 py-2 mt-2 border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
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
              className="w-full px-4 py-2 mt-2 border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
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
          <label className="block w-full">
            <span className="text-gray-700">Enrollment Date:</span>
            <input
              className="w-full px-4 py-2 mt-2 border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              type="date"
              value={enrollDate}
              onChange={(e) => setEnrollDate(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="flex flex-wrap">
          <label className="block w-full">
            <span className="text-gray-700">Have you paid for this month?</span>
            <input
              className="mt-2"
              type="checkbox"
              checked={paid}
              onChange={(e) => setPaid(e.target.checked)}
            />
          </label>
        </div>
        <div className="flex flex-wrap">
          <button
            type="submit"
            className="w-full px-4 py-2 mt-2 font-bold text-white bg-purple-600 hover:bg-purple-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdmissionForm;
