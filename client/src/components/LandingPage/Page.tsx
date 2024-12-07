import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Home from "../Home/Home";
import Auth from "../Auth/Auth";
import PostDetails from "../PostDetails/PostDetails";
import Search from "../Search/Search";
import CreatePost from "../CreatePost/CreatePost";
import EditPost from "../Posts/EditPost";
import Profile from "../Profile/Profile";

const Page = () => {
  const [currentId, setCurrentId] = useState<string>("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("profile")));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="w-full mx-auto">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/posts" replace />} />
        <Route
          path="/posts"
          element={<Home currentId={currentId} setCurrentId={setCurrentId} />}
        />
        <Route path="/posts/search" element={<Search />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route
          path="/auth"
          element={
            !user ? <Auth /> : <Navigate to="/posts" replace />
          }
        />
        <Route
          path="/create-post"
          element={
            user ? (
              <CreatePost currentId={currentId} setCurrentId={setCurrentId} />
            ) : (
              <Navigate to="/auth" state={{ from: "/create-post" }} replace />
            )
          }
        />
        <Route
          path="/edit-post/:id"
          element={user ? <EditPost /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/profile"
          element={
            user ? (
              <Profile />
            ) : (
              <Navigate to="/auth" state={{ from: "/profile" }} replace />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default Page;
