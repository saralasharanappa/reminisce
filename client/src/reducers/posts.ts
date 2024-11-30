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
} from "../constants/actionTypes";

// Define the structure of a Post
export interface Post {
  _id: string;
  title: string;
  message: string;
  creator: string;
  tags: string[];
  selectedFile: string;
  createdAt: string;
  likes: string[];
  comments: string[];
}

// Define the shape of the state
interface PostsState {
  isLoading: boolean;
  posts: Post[];
  post?: Post;
  currentPage?: number;
  numberOfPages?: number;
}

// Define the shape of the actions
interface PostsAction {
  type: string;
  payload?: any; // Adjust based on the structure of the action payload
}

const initialState: PostsState = {
  isLoading: true,
  posts: [],
};

const postsReducer = (state: PostsState = initialState, action: PostsAction): PostsState => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };
    case END_LOADING:
      return { ...state, isLoading: false };
    case FETCH_ALL:
      return {
        ...state,
        posts: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages,
      };
    case FETCH_BY_SEARCH:
      return { ...state, posts: action.payload };
    case LIKE:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      };
    case COMMENT:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post._id === action.payload._id) {
            return action.payload;
          }
          return post;
        }),
      };
    case CREATE:
      return { ...state, posts: [...state.posts, action.payload] };
    case UPDATE:
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
    case FETCH_POST:
      return { ...state, post: action.payload };
    default:
      return state;
  }
};

export default postsReducer;
