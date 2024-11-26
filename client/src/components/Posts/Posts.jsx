import React from "react";
import { useSelector } from "react-redux";
import Post from "./Post/Post";

const Posts = ({ setCurrentId }) => {
  const { posts, isLoading } = useSelector((state) => state.posts);

  if (!posts.length && !isLoading) {
    return <div className="text-center text-xl mt-5">No Posts!</div>;
  }

  return (
    <div className="flex flex-wrap justify-center p-1">
      {isLoading ? (
        <div className="w-full flex justify-center">
          <svg
            className="animate-spin h-10 w-10 border-4 rounded-full"
            viewBox="0 0 24 24"
          ></svg>
          {/* This SVG can be replaced with any loading indicator or spinner graphic */}
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="w-full sm:w-auto md:w-1/2 lg:w-1/3 p-2"
          >
            <Post post={post} setCurrentId={setCurrentId} />
          </div>
        ))
      )}
    </div>
  );
};

export default Posts;
