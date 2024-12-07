import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getPostsBySearch } from "../../actions/posts";
import Posts from "../Posts/Posts";
import { RootState } from "../../reducers";
import { AppDispatch } from "../../types/store";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Search = () => {
  const dispatch = useDispatch<AppDispatch>();
  const query = useQuery();
  const [currentId, setCurrentId] = useState("");

  const searchQuery = query.get("searchQuery") || "";
  const tags = query.get("tags") || "";

  const { posts, isLoading } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    console.log("Search Component - Search Params:", { searchQuery, tags });

    // Only dispatch search if we have search terms
    if (searchQuery.trim() !== "" || tags.trim() !== "") {
      dispatch(
        getPostsBySearch({
          search: searchQuery,
          tags: tags,
        })
      );
    } else {
      // Clear posts if no search terms
      dispatch({ type: "CLEAR_POSTS" });
    }
  }, [dispatch, searchQuery, tags]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-5 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Search Results for:{" "}
        <span className="text-blue-500">
          {searchQuery || (tags ? `Tags: ${tags}` : "All")}
        </span>
      </h2>
      {posts?.length > 0 ? (
        <div className="grid ">
          <Posts currentId={currentId} setCurrentId={setCurrentId} />
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-2">
            No results found for "{searchQuery || tags}"
          </p>
          <p className="text-sm text-gray-500">
            Please try different keywords or check your spelling
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;
