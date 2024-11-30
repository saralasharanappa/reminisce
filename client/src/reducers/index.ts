import { combineReducers } from "redux";
import posts from "./posts";
import auth from "./auth";

// Combine reducers
const rootReducer = combineReducers({
  posts,
  auth,
});

// Define the RootState type for use in the application
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
