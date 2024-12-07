import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../../actions/posts";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../reducers"; // Import RootState
import { AppDispatch } from "../../types/store";
import { useTranslation } from "react-i18next"; 

const PostForm = ({ currentId, setCurrentId }) => {
  const { t } = useTranslation();
  const [postData, setPostData] = useState({
    title: "",
    message: "",
    tags: [] as string[], // Change this to an array of strings
    selectedFile: "",
  });

  const post = useSelector((state: RootState) =>
    currentId ? state.posts.posts.find((p) => p._id === currentId) : null
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: "", message: "", tags: [], selectedFile: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("SUBMIT: ");
    e.preventDefault();
    if (currentId === 0) {
      dispatch(createPost({ ...postData, name: user?.result?.name }, navigate));
      clear();
    } else {
      dispatch(
        updatePost(currentId, { ...postData, name: user?.result?.name })
      );
      clear();
    }
  };

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

  if (!user?.result?.name) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-lg text-center ">
        <p className="text-lg font-semibold">
        {t("postForm.signInPrompt")}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg mx-auto max-w-2xl">
      <form
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
        {currentId
            ? t("postForm.editing", { title: post?.title })
            : t("postForm.creating")}
        </h2>

        <input
          type="text"
          name="title"
          placeholder={t("postForm.titlePlaceholder")}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />

        <textarea
          name="message"
          placeholder={t("postForm.messagePlaceholder")}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={postData.message}
          onChange={(e) =>
            setPostData({ ...postData, message: e.target.value })
          }
        />

        <input
          type="text"
          name="tags"
          placeholder={t("postForm.tagsPlaceholder")}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={postData.tags.join(",")} // Join array into string for display
          onChange={(e) =>
            setPostData({ ...postData, tags: e.target.value.split(",") })
          }
        />

        <div className="w-full mt-2 mb-4">
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
          {t("postForm.submitButton")}
        </button>

        <button
          type="button"
          className="w-full py-2 px-4 bg-gray-500 text-white font-bold rounded hover:bg-gray-600 transition-colors mt-2"
          onClick={clear}
        >
          {t("postForm.clearButton")}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
