//App.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <h1 className="text-5xl font-bold text-white mb-10">
        🎓 Student-Centric Freelancing
      </h1>
      <div className="flex gap-6">
        <Link
          to="/login"
          className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold shadow hover:bg-gray-100"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700"
        >
          Signup
        </Link>
      </div>
    </div>
  );
}
