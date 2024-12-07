// rootReducer.ts

import { combineReducers } from "redux";
import posts from "./posts"; // Your posts reducer
import auth from "./auth";
import user from "./user";
import { PostsState } from "./types";
import { UserState } from "./types"; // Import PostsState type

const rootReducer = combineReducers({
  posts,
  auth,
  user,
});

export type RootState = {
  posts: PostsState; // Define the state structure for posts
  auth: any; // Define auth type
  user: UserState; // Define user type
};

export default rootReducer;

