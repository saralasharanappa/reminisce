import React from "react";
import { useSelector } from "react-redux";
import Post from "./Post/Post";
import { RootState } from "../../reducers"; // Import RootState for type checking
import Loader from '../Loader/Loader';

interface PostProps {
  setCurrentId: (id: string) => void;
  currentId: string;
}

const Posts: React.FC<PostProps> = ({ setCurrentId, currentId }) => {
  // Type the state as RootState to access the posts properly
  const { posts, isLoading } = useSelector((state: RootState) => state.posts);

  if (isLoading) return <Loader />;
  
  if (!posts.length && !isLoading) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <p className="text-xl text-gray-600">No posts found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {posts.map((post) => (
        <div key={post._id} className="transform transition-all duration-200 hover:scale-[1.02]">
          <Post post={post} setCurrentId={setCurrentId} />
        </div>
      ))}
    </div>
  );
};

export default Posts;
