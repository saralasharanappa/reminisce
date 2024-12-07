import {
  CREATE,
  UPDATE,
  DELETE,
  FETCH_POST,
  FETCH_ALL,
  FETCH_BY_SEARCH,
  START_LOADING,
  END_LOADING,
  COMMENT,
} from "../constants/actionTypes.js";
import * as api from "../api";
import { Dispatch } from "redux";

export interface PostData {
  title: string;
  message: string;
  name?: string;
  creator?: string;
  tags: string[];
  selectedFile: string;
  likes?: string[];
  createdAt?: string;
  _id?: string;
}

export const getPost = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchPost(id);
    //dispatch({ type: FETCH_POST, payload: { post: data } });
    dispatch({ type: FETCH_POST, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const getPosts =
  (page: string | number) => async (dispatch: Dispatch) => {
    try {
      dispatch({ type: START_LOADING });
      console.log("Fetching posts for page:", page); // Debug log

      const { data } = await api.fetchPosts(page);
      console.log("Raw API response:", data); // Debug log

      dispatch({
        type: FETCH_ALL,
        payload: data, // Send the entire data object directly
      });

      dispatch({ type: END_LOADING });
    } catch (error) {
      console.error("Error fetching posts:", error);
      dispatch({ type: END_LOADING });
    }
  };

// export const getPostsBySearch = (searchQuery) => async (dispatch) => {
//   try {
//     dispatch({ type: START_LOADING });
//     const {
//       data: { data },
//     } = await api.fetchPostsBySearch(searchQuery);
//     dispatch({ type: FETCH_BY_SEARCH, payload: data });
//     dispatch({ type: END_LOADING });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    console.log("Action Creator - Before API call:", searchQuery);

    const { data } = await api.fetchPostsBySearch(searchQuery);
    console.log("Action Creator - API Response:", data);

    if (data) {
      dispatch({ type: FETCH_BY_SEARCH, payload: data });
      dispatch({ type: END_LOADING });
    }
  } catch (error) {
    console.error("Search error:", error);
    dispatch({ type: END_LOADING });
  }
};

export const createPost = (post, navigate) => async (dispatch) => {
  try {
    console.log("CEATE POST DATA: ", post);
    dispatch({ type: START_LOADING });
    const { data } = await api.createPost(post);
    navigate(`/posts/${data._id}`);
    dispatch({ type: CREATE, payload: data });
    console.log("Create Post Response:", data);
    return data;
  } catch (error) {
    console.log("Get Post Error:", error.message, error.response);
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);
    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log("Update Post Error: " + error);
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);
    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.log("Delete Post Error: " + error);
  }
};

export const likePost = (id) => async (dispatch) => {
  try {
    const { data } = await api.likePost(id);
    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log("Like Post Error: " + error);
  }
};

export const commentPost = (value, id) => async (dispatch) => {
  try {
    const { data } = await api.comment(value, id);

    dispatch({ type: COMMENT, payload: data });
    console.log(data);
    return data.comments;
  } catch (error) {
    console.log(error);
  }
};
