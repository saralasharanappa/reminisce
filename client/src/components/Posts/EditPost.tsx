import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from "../../actions/posts";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../reducers";
import { AppDispatch } from "../../types/store";
// import { Post } from "../../reducers/types";

interface PostData {
  title: string;
  message: string;
  tags: string[];
  selectedFile: string;
  name?: string;
}

const EditPost = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState<PostData>({
    title: "",
    message: "",
    tags: [],
    selectedFile: "",
  });

  const post = useSelector((state: RootState) =>
    id ? state.posts.posts.find((p) => p._id === id) : null
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    if (post) {
      setPostData({
        title: post.title,
        message: post.message,
        tags: post.tags,
        selectedFile: post.selectedFile,
      });
    }
  }, [post]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPostData({ ...postData, selectedFile: reader.result as string });
      };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      dispatch(updatePost(id, { ...postData, name: user?.result?.name }));
      navigate("/posts"); // Redirect to the posts page after editing
    }
  };

  if (!user?.result?.name) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-lg text-center">
        <p className="text-lg font-semibold">
          Please Sign In to edit your memories!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">Edit Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />

        <textarea
          name="message"
          placeholder="Message"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={postData.message}
          onChange={(e) =>
            setPostData({ ...postData, message: e.target.value })
          }
        />

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={postData.tags.join(",")}
          onChange={(e) =>
            setPostData({
              ...postData,
              tags: e.target.value.split(",").map((tag) => tag.trim()),
            })
          }
        />

        <div className="w-full mt-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-colors"
        >
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPost;
