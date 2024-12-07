import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { commentPost } from "../../actions/posts";
import { AppDispatch } from "../../types/store";

interface Post {
  _id: string;
  comments: string[];
}

interface User {
  result: {
    name: string;
  };
}

interface CommentSectionProps {
  post: Post;
}

const CommentSection = ({ post }: CommentSectionProps) => {
  const [comments, setComments] = useState(post?.comments || []);
  const [comment, setComment] = useState("");
  const user = JSON.parse(localStorage.getItem("profile")) as User;
  const dispatch = useDispatch<AppDispatch>();
  const commentsRef = useRef<HTMLDivElement>(null);

  const handleComment = async () => {
    const finalComment = `${user.result.name}: ${comment}`;
    const newComments = await dispatch(commentPost(finalComment, post._id));
    if (newComments) {
      setComments(newComments);
      setComment("");

      // Scroll to bottom of comments
      if (commentsRef.current) {
        commentsRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col space-y-4">
        <h6 className="text-xl font-semibold">Comments</h6>
        <div className="max-h-[200px] overflow-y-auto space-y-2">
          {comments.map((c, i) => (
            <div key={i} className="p-2 bg-gray-100 rounded">
              {c}
            </div>
          ))}
          <div ref={commentsRef} />
        </div>
        {user?.result?.name && (
          <div className="space-y-2">
            <textarea
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={!comment.trim()}
              onClick={handleComment}
            >
              Comment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
