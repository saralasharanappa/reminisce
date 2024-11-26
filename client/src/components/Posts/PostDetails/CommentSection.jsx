import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { commentPost } from "../../actions/posts";

const CommentSection = ({ post }) => {
  const [comments, setComments] = useState(post?.comments);
  const [comment, setComment] = useState("");
  const user = JSON.parse(localStorage.getItem("profile"));
  const dispatch = useDispatch();
  const commentsRef = useRef();

  const handleComment = async () => {
    const finalComment = `${user.result.name}: ${comment}`;
    const newComments = await dispatch(commentPost(finalComment, post._id));
    setComments(newComments);
    setComment("");
    commentsRef.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="p-5">
      <div className="mb-5">
        <h5 className="text-lg font-bold mb-4">Comments</h5>
        {comments.map((c, i) => (
          <p key={i} className="mb-1">
            <strong>{c.split(": ")[0]}</strong>
            {c.split(":")[1]}
          </p>
        ))}
        <div ref={commentsRef} />
      </div>
      {user?.result?.name && (
        <div className="w-11/12 mx-auto">
          <h6 className="text-base font-bold mb-2">Write a Comment</h6>
          <textarea
            className="w-full p-2 border rounded mb-2"
            rows="4"
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
              !comment.length ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!comment.length}
            onClick={handleComment}
          >
            Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
