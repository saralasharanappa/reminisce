import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getPostsBySearch } from "../../actions/posts";
import memoriesLogo from "../../images/memoriesLogo.png";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import { useTheme } from "../../context/ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { AppDispatch } from "../../types/store";
import { useTranslation } from "react-i18next";
import '../../i18n';

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
  const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem("language") || "en");

  const { t, i18n } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  console.log(user);
  // localStorage.clear();

  const logout = useCallback(() => {
    localStorage.removeItem("profile");
    navigate("/");
    setUser(null);
  }, [navigate]);

  // Change language
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const handleSearch = () => {
    if (search.trim()) {
      dispatch(getPostsBySearch({ search, tags: "" }));
      navigate(`/posts/search?searchQuery=${search || "none"}&tags=`);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("profile")));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

 useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }
    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [logout, user?.token]);

  useEffect(() => {
    // Update count when localStorage changes
    const updateUnreadCount = () => {
      const count = parseInt(
        localStorage.getItem("unreadNotifications") || "0"
      );
      setUnreadCount(count);
    };

    // Initial count
    updateUnreadCount();

    // Listen for storage changes
    window.addEventListener("storage", updateUnreadCount);
    return () => window.removeEventListener("storage", updateUnreadCount);
  }, []);

  return (
    <header
      className={`${
        darkMode ? "bg-gray-800" : "bg-blue-500"
      } transition-colors duration-200 shadow-lg py-4`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Brand Logo Section */}
          <Link to="/posts" className="flex items-center">
            <img
              src={memoriesLogo}
              alt="Memories logo"
              className="h-10 w-10 rounded-full"
            />
            <span className="text-2xl md:text-3xl font-bold text-white tracking-wide ml-3">
            {t("navbar.title")}
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6 text-white font-semibold">
              <button
                onClick={() => setShowSearch((prev) => !prev)}
                className="hover:text-gray-200 transition"
              >
                <SearchIcon fontSize="large" />
              </button>
              <Link
                to="/create-post"
                className="hover:text-gray-200 transition"
              >
                <AddIcon fontSize="large" />
              </Link>
              <Link to="/notifications" className="relative">
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon fontSize="large" />
                </Badge>
              </Link>
              <Link to="/profile" className="hover:text-gray-200 transition">
                <AccountCircleIcon fontSize="large" />
              </Link>
              <button
                onClick={toggleDarkMode}
                className="hover:text-gray-200 transition"
              >
                {darkMode ? (
                  <LightModeIcon fontSize="large" />
                ) : (
                  <DarkModeIcon fontSize="large" />
                )}
              </button>
              <div className="ml-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`px-3 py-1 rounded ${
                      currentLanguage === "en" 
                        ? "bg-white text-blue-500" 
                        : "bg-blue-400 text-white hover:bg-blue-300"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage("kn")}
                    className={`px-3 py-1 rounded ${
                      currentLanguage === "kn" 
                        ? "bg-white text-blue-500" 
                        : "bg-blue-400 text-white hover:bg-blue-300"
                    }`}
                  >
                    ಕನ್ನಡ
                  </button>
                </div>
              </div>
            </nav>

            {/* User Section */}
            {user?.result ? (
              <div className="flex items-center space-x-4">
                <p className="text-lg font-semibold text-white hidden lg:block">
                  {user?.result.name}
                </p>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={logout}
                >
                  {t("navbar.logout")}
                </button>
              </div>
            ) : (
              <Link to="/auth">
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                {t("navbar.signIn")}
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"} mt-4`}>
          <nav className="flex flex-col space-y-4 text-white">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 hover:text-gray-200"
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              <span>{darkMode ? t("navbar.lightMode") : t("navbar.darkMode")}</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => changeLanguage("en")}
                className={`px-3 py-1 rounded ${
                  currentLanguage === "en" 
                    ? "bg-white text-blue-500" 
                    : "bg-blue-400 text-white hover:bg-blue-300"
                }`}
              >
                English
              </button>
              <button
                onClick={() => changeLanguage("kn")}
                className={`px-3 py-1 rounded ${
                  currentLanguage === "kn" 
                    ? "bg-white text-blue-500" 
                    : "bg-blue-400 text-white hover:bg-blue-300"
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>

            {/* Existing Mobile Menu Items */}
            <button
              onClick={() => {
                setShowSearch((prev) => !prev);
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-2 hover:text-gray-200"
            >
              <SearchIcon /> <span>{t("navbar.search")}</span>
            </button>
            <Link
              to="/create-post"
              className="flex items-center space-x-2 hover:text-gray-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <AddIcon /> <span>{t("navbar.create")}</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center space-x-2 hover:text-gray-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <AccountCircleIcon /> <span>{t("navbar.profile")}</span>
            </Link>
            <Link
              to="/notifications"
              className="flex items-center space-x-2 hover:text-gray-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
              <span>{t("navbar.notifications")}</span>
            </Link>

            {user?.result ? (
              <>
                <p className="text-lg font-semibold">{user?.result.name}</p>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">
                  Sign In
                </button>
              </Link>
            )}
          </nav>
        </div>

        {/* Search Section */}
        {showSearch && (
          <div className="bg-white p-4 shadow-md rounded-lg w-[90%] mx-auto mt-4">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder={t("navbar.searchPlaceholder")}
                className="flex-grow px-4 py-2 text-gray-700 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 flex items-center"
              >
                <SearchIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
