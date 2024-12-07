import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import Page from "./components/LandingPage/Page";
import Notifications from "./components/Notifications/Notifications";
import { useTheme } from "./context/ThemeContext";

function App() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`${
        darkMode ? "dark bg-gray-900" : "bg-gray-100"
      } min-h-screen transition-colors duration-200`}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/*" element={<Page />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
