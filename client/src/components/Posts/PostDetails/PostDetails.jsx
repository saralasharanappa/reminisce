import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, getPostsBySearch } from "../../actions/posts";
import CommentSection from "./CommentSection";

const PostDetails = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPost(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (post) {
      dispatch(
        getPostsBySearch({ search: "none", tags: post?.tags.join(",") })
      );
    }
  }, [dispatch, post]);

  if (!post) return null;

  const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);
  const openPost = (id) => navigate(`/posts/${id}`);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-500"
          viewBox="0 0 24 24"
        >
          {/* Spinner SVG */}
        </svg>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-lg shadow-lg">
      <div>
        <h2 className="text-3xl font-bold">{post.title}</h2>
        <div className="text-gray-600 my-2">
          {post.tags.map((tag, index) => (
            <span key={index} className="mr-2">
              #{tag}
            </span>
          ))}
        </div>
        <p>{post.message}</p>
        <p className="text-gray-600">Created by: {post.name}</p>
        <p className="text-gray-500">{moment(post.createdAt).fromNow()}</p>

        <CommentSection post={post} />
        <hr className="my-4" />
      </div>
      <div>
        {post.selectedFile && (
          <img
            className="rounded"
            src={post.selectedFile}
            alt={post.title}
            style={{ maxHeight: "300px" }}
          />
        )}
      </div>
      {!!recommendedPosts.length && (
        <div>
          <h5 className="text-xl font-bold">You might also like:</h5>
          <hr />
          <div className="grid grid-cols-3 gap-4">
            {recommendedPosts.map(
              ({ title, name, message, likes, selectedFile, _id }) => (
                <div
                  key={_id}
                  className="p-3 cursor-pointer"
                  onClick={() => openPost(_id)}
                >
                  <h6 className="text-lg font-bold">{title}</h6>
                  <p className="text-sm">{name}</p>
                  <p className="text-sm">{message}</p>
                  <p className="text-sm">Likes: {likes.length}</p>
                  {selectedFile && (
                    <img
                      src={selectedFile}
                      alt={title}
                      className="max-w-full h-auto"
                    />
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
