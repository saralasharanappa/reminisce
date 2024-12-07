// src/reducers/auth.ts
import { AUTH, LOGOUT } from "../constants/actionTypes.js";

// Defining the types directly in the reducer
interface AuthState {
  authData: any | null;
}

interface Action {
  type: string;
  data: any;
}

const authReducer = (
  state: AuthState = { authData: null },
  action: Action
): AuthState => {
  switch (action.type) {
    case AUTH:
      try {
        // Store minimal user data
        const minimalUserData = {
          ...action.data,
          result: {
            ...action.data.result,
            // Either store URL or remove profilePicture from localStorage
            profilePicture: undefined, // Don't store image in localStorage
          },
        };
        localStorage.setItem("profile", JSON.stringify(minimalUserData));
        return { ...state, authData: action.data };
      } catch (error) {
        console.error("Error in auth reducer:", error);
        return state;
      }

    case LOGOUT:
      // Clear localStorage on logout
      localStorage.clear();
      return { ...state, authData: null };

    default:
      return state;
  }
};

export default authReducer;
