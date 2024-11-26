import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getPosts, getPostsBySearch } from "../../actions/posts";
import Posts from "../Posts/Posts";
import Form from "../Form/Form";
import Paginate from "../Pagination";
import { useNavigate, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();
  const query = useQuery();
  const history = useNavigate();
  const page = query.get("page") || 1;
  const searchQuery = query.get("searchQuery");
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([]);

  const searchPost = () => {
    if (search.trim() || tags.length) {
      dispatch(getPostsBySearch({ search, tags: tags.join(",") }));
      history(
        `/posts/search?searchQuery=${search || "none"}&tags=${tags.join(",")}`
      );
    } else {
      history("/");
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost();
    }
  };

  const handleAdd = (tag) => setTags([...tags, tag]);
  const handleDelete = (tagToDelete) =>
    setTags(tags.filter((tag) => tag !== tagToDelete));

  return (
    <div className="grow">
      <div className="container max-w-screen mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-3">
            <Posts setCurrentId={setCurrentId} />
          </div>
          <div className="col-span-1  ">
            <div className="bg-white p-4 shadow-md rounded-lg w-[90%] mx-auto mt-5">
              <input
                type="text"
                name="search"
                placeholder="Search Memories"
                className="input input-bordered w-full mb-4"
                onKeyDown={handleKeyPress}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, index) => (
                  <div key={index} className="badge badge-outline">
                    {tag}
                    <button className="ml-2" onClick={() => handleDelete(tag)}>
                      x
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={searchPost}
                className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-colors"
              >
                Search
              </button>
            </div>
            <div className="w-[90%] mx-auto mt-5">
              <Form currentId={currentId} setCurrentId={setCurrentId} />
            </div>
            {!searchQuery && !tags.length && (
              <div className="shadow-md rounded-lg p-4 mt-4 w-[90%] mx-auto">
                <Paginate page={page} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
