import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import memoriesLogo from "../../images/memoriesLogo.png";
// import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode"; // Fixing import here

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.clear(); // Clear user data from localStorage
    navigate("/");
    setUser(null);
  }, [navigate]);

  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }
    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [logout, user?.token]);

  return (
    <header className="bg-slate-400 shadow  border-spacing-1">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Brand Logo Section */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center">
            <img src={memoriesLogo} alt="Memories logo" className="h-10 ml-2" />
            <span className="text-3xl font-bold text-white tracking-wide ml-3">
              REMINISCE
            </span>
          </Link>
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-4 p-4">
          {user?.result ? (
            <div className="flex items-center space-x-4">
              <p className="text-lg font-semibold">{user?.result.name}</p>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-md"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
