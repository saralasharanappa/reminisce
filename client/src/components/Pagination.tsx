import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../actions/posts";
import { useNavigate } from "react-router-dom";
import rootReducer from "../reducers";

type RootState = ReturnType<typeof rootReducer>;

const Paginate = ({ page }) => {
  const { numberOfPages } = useSelector((state: RootState) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (page) dispatch(getPosts(page));
  }, [dispatch, page]);

  const changePage = (newPage) => {
    navigate(`/posts?page=${newPage}`);
  };

  return (
    <div className="flex justify-around mt-4">
      <div className="flex space-x-2">
        {Array.from({ length: numberOfPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-4 py-2 rounded-md border ${
              Number(page) === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => changePage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Paginate;
