import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://final-hackathon-smit-in-backend.vercel.app/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("name", data.user.name || formData.name);
        localStorage.setItem("email", data.user.email || formData.email);
        toast.success("Signup successful!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-[#0f172a] p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-purple-400 text-center mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#1f2937] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <FaUser className="absolute right-3 top-2.5 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#1f2937] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <FaEnvelope className="absolute right-3 top-2.5 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#1f2937] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <FaLock className="absolute right-3 top-2.5 text-gray-400" />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-gray-300 text-center mt-4">
          Already have an account?{" "}
          <Link to="/Login" className="text-purple-400 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
