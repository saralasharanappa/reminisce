// src/reducers/posts.ts

import {
  CREATE,
  UPDATE,
  DELETE,
  FETCH_POST,
  FETCH_ALL,
  FETCH_BY_SEARCH,
  LIKE,
  START_LOADING,
  END_LOADING,
  COMMENT,
} from "../constants/actionTypes.js";

interface PostsState {
  posts: any[];
  post: any | null;
  currentPage: number;
  numberOfPages: number;
  isLoading: boolean;
}

const initialState: PostsState = {
  posts: [],
  post: null,
  currentPage: 1,
  numberOfPages: 1,
  isLoading: false,
};

const postsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };

    case END_LOADING:
      return { ...state, isLoading: false };

    case FETCH_ALL:
      console.log("Reducer FETCH_ALL:", action.payload);
      return {
        ...state,
        posts: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages,
      };

    case FETCH_BY_SEARCH:
      return { ...state, posts: action.payload.data };

    case FETCH_POST:
      return { ...state, post: action.payload };

    case CREATE:
      return { ...state, posts: [...state.posts, action.payload] };

    case UPDATE:
    case LIKE:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      };

    case DELETE:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload),
      };

    case COMMENT:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post._id === action.payload._id) return action.payload;
          return post;
        }),
      };

    default:
      return state;
  }
};

export default postsReducer;
