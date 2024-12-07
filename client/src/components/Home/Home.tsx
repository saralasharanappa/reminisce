import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getPosts } from "../../actions/posts";
import Posts from "../Posts/Posts";
import { useLocation } from "react-router-dom";
import Paginate from "../Pagination";
import { AppDispatch } from "../../types/store";

interface HomeProps {
  currentId: string; // Changed from number to string
  setCurrentId: (id: string) => void; // Changed from number to string
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = ({ currentId, setCurrentId }: HomeProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const query = useQuery();
  const page = query.get("page") || 1;
  const searchQuery = query.get("searchQuery");

  useEffect(() => {
    if (!searchQuery) {
      dispatch(getPosts(page));
    }
  }, [dispatch, page, searchQuery]);

  return (
    <div className="grow">
      <div className="container max-w-screen mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="col-span-3">
            <Posts currentId={currentId} setCurrentId={setCurrentId} />
          </div>
          {!searchQuery && (
            <div className="col-span-3">
              <Paginate page={page} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
