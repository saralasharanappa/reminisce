import React, { useState } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../types/store";
import { deletePost, likePost } from "../../../actions/posts";
import { useNavigate } from "react-router-dom";

const Post = ({ post, setCurrentId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));
  const [likes, setLikes] = useState(post?.likes);

  const handleEdit = () => {
    if (user?.result?._id === post?.creator) {
      navigate(`/edit-post/${post._id}`); // Navigate to the edit page with post ID
    } else {
      console.log("You are not the creator of this post.");
    }
  };

  // Ensure both values are strings for comparison
  const isCreator = String(user?.result?._id) === String(post?.creator);

  const handleLike = () => {
    const alreadyLiked = likes.includes(user?.result?._id);
    dispatch(likePost(post._id));
    setLikes(
      alreadyLiked
        ? likes.filter((id) => id !== user?.result?._id)
        : [...likes, user?.result?._id]
    );
  };

  const Likes = () => {
    if (likes.length > 0) {
      return likes.includes(user?.result?._id) ? (
        <span>
          👍 &nbsp;
          {likes.length > 2
            ? `You and ${likes.length - 1} others`
            : `${likes.length} like${likes.length > 1 ? "s" : ""}`}
        </span>
      ) : (
        <span>
          👍 &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
        </span>
      );
    }
    return <span>👍 &nbsp;Like</span>;
  };

  const openPost = () => navigate(`/posts/${post._id}`);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden h-full flex flex-col justify-between relative">
      {/* Media Section */}
      <button onClick={openPost} className="focus:outline-none w-full relative">
        <img
          src={post.selectedFile || "https://via.placeholder.com/400"}
          alt={post.title}
          className="w-full h-56 object-cover bg-gray-800 bg-opacity-75"
        />
        <div className="absolute top-5 left-5 text-white bg-gray-900 bg-opacity-75 rounded px-2 py-1">
          <p className="font-semibold">{post.name}</p>
          <p className="text-sm">{moment(post.createdAt).fromNow()}</p>
        </div>
      </button>

      {/* Edit Button (Visible only to the creator) */}
      {isCreator && (
        <button
          className="absolute top-5 right-5 text-white bg-gray-800 bg-opacity-75 rounded-full p-1"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
        >
          ⋮
        </button>
      )}

      {/* Post Content */}
      <div className="p-4 flex-grow">
        <p className="text-sm text-gray-600 mb-2">
          {post.tags.map((tag) => `#${tag} `)}
        </p>
        <h5 className="text-lg font-bold">{post.title}</h5>
        <p className="text-gray-700 mt-2">
          {post.message.split(" ").splice(0, 20).join(" ")}...
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center p-4 border-t border-gray-200">
        <button
          className="text-blue-500 hover:text-blue-600 focus:outline-none"
          onClick={handleLike}
          disabled={!user?.result}
        >
          <Likes />
        </button>
        {isCreator && (
          <button
            className="text-red-500 hover:text-red-600 focus:outline-none flex items-center"
            onClick={() => dispatch(deletePost(post._id))}
          >
            🗑 &nbsp; Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default Post;
