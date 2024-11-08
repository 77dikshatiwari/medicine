import React, { useContext, useState } from "react";
import { AuthContent } from "../context/AuthContent.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader.jsx";
import { MdHealthAndSafety } from "react-icons/md";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContent);
  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${api_url}/users/login`, {
        email,
        password,
      });
      console.log(response.data);
      login(response.data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(`Login Error: ${error.message}`);
      setLoading(false);
      if (error.response) {
        setError(error.response.data.message);
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
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
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {loading && <Loader loading={loading} />}
        {!loading && (
          <>
            <div className="flex items-center justify-center text-2xl font-semibold mb-6 text-blue-500">
              <MdHealthAndSafety className="text-3xl mr-2" /> MediBot
            </div>
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
              Login
            </button>
            <div className="text-center mt-4">
              Don't have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;
