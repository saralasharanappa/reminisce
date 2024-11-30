import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../../actions/posts";
import FileBase from "react-file-base64";
import { useNavigate } from "react-router-dom";
import rootReducer from "../../reducers"; // Import rootReducer

// Derive RootState directly from rootReducer
type RootState = ReturnType<typeof rootReducer>;

interface FormProps {
  currentId: number;
  setCurrentId: (id: number) => void;
}

const Form: React.FC<FormProps> = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({
    title: "",
    message: "",
    tags: [] as string[],
    selectedFile: "",
  });

  const post = useSelector((state: RootState) =>
    currentId
      ? state.posts.posts.find((p) => p._id === currentId.toString())
      : null
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile") || "null");

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: "", message: "", tags: [], selectedFile: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  if (!user?.result?.name) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-lg text-center">
        <p className="text-lg font-semibold">
          Please Sign In to create your own memories and like others' memories!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <form
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          {currentId ? `Editing "${post?.title}"` : "Creating a Memory"}
        </h2>

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
            setPostData({ ...postData, tags: e.target.value.split(",") })
          }
        />

        <div className="w-full mt-2 mb-4">
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>

        <button
          type="button"
          className="w-full py-2 px-4 bg-gray-500 text-white font-bold rounded hover:bg-gray-600 transition-colors mt-2"
          onClick={clear}
        >
          Clear
        </button>
      </form>
    </div>
  );
};

export default Form;
