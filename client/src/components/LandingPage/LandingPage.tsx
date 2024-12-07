import React from "react";
import { useNavigate } from "react-router-dom";
import memoriesLogo from "../../images/memoriesLogo.png";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import PB from "./BackgroundEffect/particles";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/posts");
  };

  return (
    <PB>
      <div className="min-h-screen  z-500">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center space-y-12 text-center">
            {/* Logo Section */}
            <section className="flex flex-col items-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-white p-2 shadow-lg">
                <div className="relative h-full w-full">
                  <img
                    src={memoriesLogo}
                    alt="Memories logo"
                    className="rounded-full object-contain p-2 h-full w-full animate-pulse"
                  />
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl ">
                REMINISCE
              </h1>
              <p className="max-w-2xl text-lg text-white/90">
                Create, share, and preserve your precious memories in one
                beautiful place
              </p>
            </section>

            {/* Main Content */}
            <div>
              <div className="mx-auto max-w-2xl overflow-hidden bg-white/95 rounded-lg shadow-2xl">
                <div className="px-6 py-8 sm:px-8">
                  <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                    Start Your Memory Journey
                  </h2>
                  <p className="mb-6 text-gray-600">
                    Join our community to create and share your memorable
                    moments with friends and family.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <button
                      onClick={handleGetStarted}
                      className="inline-block px-6 py-3 text-white font-semibold rounded-md bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 transition-colors duration-300 cursor-pointer"
                    >
                      Let Create Memories <ArrowRightIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto py-6 text-center text-white/80">
          <p>
            &copy; {new Date().getFullYear()} REMINISCE. All rights reserved.
          </p>
        </footer>
      </div>
    </PB>
  );
}
