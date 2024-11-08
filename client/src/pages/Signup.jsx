import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import { MdHealthAndSafety } from "react-icons/md";


const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${api_url}/users/signup`, {
        username,
        email,
        password,
      });
      console.log(response.data);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      console.log(`Signup Error: ${error.message}`);
      setLoading(false);
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        {loading && <Loader loading={loading} />} {/* Show loader */}
        {!loading && (
          <>
            <div className="flex items-center justify-center text-2xl font-semibold mb-6 text-blue-500">
              <MdHealthAndSafety className="text-3xl mr-2" /> MediBot
            </div>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-300"
            >
              Signup
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Signup;
