import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const Navbar: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("profile") || "null");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("profile");
    navigate("/auth");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-bold">
          MyApp
        </Link>

        {/* Links */}
        <div className="flex space-x-4">
          <Link
            to="/"
            className="text-white hover:text-blue-300 font-medium transition"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-white hover:text-blue-300 font-medium transition"
          >
            About
          </Link>
          {user && (
            <Link
              to="/profile"
              className="text-white hover:text-blue-300 font-medium transition"
            >
              Profile
            </Link>
          )}
        </div>

        {/* Authentication */}
        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">
                Welcome, {user.result.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
