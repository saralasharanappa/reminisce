import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, getPostsBySearch } from "../../actions/posts";
import CommentSection from "./CommentSection";
import { RootState } from "../../reducers"; // Import RootState to use it for type-checking
import { AppDispatch } from "../../types/store";
import Loader from '../Loader/Loader';
import { useTranslation } from "react-i18next";
import { VolumeUp, GetApp, Share } from '@mui/icons-material';

const PostDetails = () => {
  const { t, i18n } = useTranslation(); 
  // Type the state with RootState so TypeScript knows the shape of the state
  const { post, posts, isLoading } = useSelector(
    (state: RootState) => state.posts
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Type for 'id'

  useEffect(() => {
    dispatch(getPost(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (post?.tags) {
      dispatch(getPostsBySearch({ search: "none", tags: post.tags.join(",") }));
    }
  }, [dispatch, post]);

  const recommendedPosts = posts?.filter((p) => p?._id !== post?._id) || [];

  if (isLoading) return <Loader />;

  if (!post) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow m-4">
        <p className="text-xl text-gray-600">Post not found</p>
      </div>
    );
  }

  const openPost = (id: string) => navigate(`/posts/${id}`);

  const handleReadAloud = () => {
    const synth = window.speechSynthesis;
    if (!synth) {
      alert(t("postDetails.readAloudNotSupported"));
      return;
    }
    const utterance = new SpeechSynthesisUtterance(post.message);
    utterance.lang = i18n.language; // Use the current language from i18next
    synth.speak(utterance);
  };

  const handleDownloadPDF = () => {
    console.log("Downloading PDF...");
    const printableArea = document.getElementById("post-content").innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>${post.title} - PDF</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            h1, h2, h3 {
              text-align: center;
            }
            img {
              display: block;
              margin: 20px auto;
              max-width: 100%;
            }
            p, span {
              margin-bottom: 10px;
            }
            .tag {
              margin-right: 5px;
              color: gray;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: gray;
            }
          </style>
        </head>
        <body>
          ${printableArea}
          <div class="footer">${t("postDetails.generatedByFugu")}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSharePost = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.message,
          url: `${window.location.origin}/posts/${post._id}`,
        });
        alert(t("postDetails.shareSuccess"));
      } catch (error) {
        alert(t("postDetails.shareError"));
        console.error("Share failed:", error);
      }
    } else {
      alert(t("postDetails.shareNotSupported"));
    }
  };

  const PostActions = ({ handleReadAloud, handleDownloadPDF, handleSharePost }) => {
    const { t } = useTranslation();

    return (
      <div className="relative bottom-0 left-0 right-0 flex justify-around p-4 bg-gradient-to-t from-black/50 to-transparent z-1">
        <button
          onClick={handleReadAloud}
          className="group relative flex items-center justify-center w-12 h-12 bg-green-500 rounded-full hover:bg-green-600 transition-colors duration-200"
          title={t("post.readAloud")}
        >
          <VolumeUp className="text-white text-2xl" />
          <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform duration-200 bg-black/75 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
            {t("post.readAloud")}
          </span>
        </button>

        <button
          onClick={handleDownloadPDF}
          className="group relative flex items-center justify-center w-12 h-12 bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-200"
          title={t("post.downloadPDF")}
        >
          <GetApp className="text-white text-2xl" />
          <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform duration-200 bg-black/75 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
            {t("post.downloadPDF")}
          </span>
        </button>

        <button
          onClick={handleSharePost}
          className="group relative flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors duration-200"
          title={t("post.sharePost")}
        >
          <Share className="text-white text-2xl" />
          <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform duration-200 bg-black/75 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
            {t("post.sharePost")}
          </span>
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden " >
        {/* Main Post Content */}
        <div className="md:flex" id="post-content">
          
          {/* Left side - Image */}
          <div className="md:w-3/5 bg-gray-100">
            {post.selectedFile ? (
              <div className="relative h-[500px]">
                <img
                  className="w-full h-full object-cover"
                  src={post.selectedFile}
                  alt={post.title}
                />
              </div>
            ) : (
              <div className="h-[500px] flex items-center justify-center bg-gray-200">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
            <PostActions handleReadAloud={handleReadAloud} handleDownloadPDF={handleDownloadPDF} handleSharePost={handleSharePost} />
            
          </div>
          

          

          {/* Right side - Post Details */}
          <div className="md:w-2/5 p-6">
            <div className="space-y-4">
              {/* Author and Time */}
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {post.name[0]}
                </div>
                <div>
                  <p className="font-medium">{post.name}</p>
                  <p className="text-sm">{moment(post.createdAt).fromNow()}</p>
                </div>
              </div>

              {/* Title and Tags */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {post.title}
                </h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Message */}
              <p className="text-gray-700 leading-relaxed">{post.message}</p>

              {/* Comments Section */}
              <div className="mt-8">
                <CommentSection post={post} />
              </div>
              
            </div>
          </div>
        </div>

        {/* Recommended Posts */}
        {recommendedPosts.length > 0 && (
          <div className="p-6 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              You might also like:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedPosts
                .slice(0, 3)
                .map(({ title, name, message, likes, selectedFile, _id }) => (
                  <div
                    key={_id}
                    onClick={() => openPost(_id)}
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                  >
                    {selectedFile && (
                      <div className="relative h-48">
                        <img
                          src={selectedFile}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">
                        {title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">By {name}</p>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {message}
                      </p>
                      <div className="mt-4 flex items-center text-gray-600">
                        <svg
                          className="w-5 h-5 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{likes.length} likes</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
