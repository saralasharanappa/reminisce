import { UserProfile } from "./types";
import { AUTH, LOGOUT } from "../constants/actionTypes";

interface UserState {
  authData: any | null;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  authData: JSON.parse(localStorage.getItem("profile")),
  user: null,
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case AUTH:
      const authData = {
        ...action.data,
        result: {
          ...action.data.result,
          profilePicture: action.data.result.profilePicture
        }
      };
      localStorage.setItem("profile", JSON.stringify(authData));
      return { 
        ...state, 
        authData: authData,
        user: authData.result 
      };

    case LOGOUT:
      localStorage.removeItem("profile");
      return { ...state, authData: null, user: null };

    case "FETCH_USER_PROFILE_LOADING":
      return { ...state, loading: true };

    case "FETCH_USER_PROFILE":
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };

    case "UPDATE_PROFILE":
      const updatedAuth = {
        ...state.authData,
        result: {
          ...state.authData?.result,
          ...action.payload
        }
      };
      localStorage.setItem("profile", JSON.stringify(updatedAuth));
      return {
        ...state,
        user: action.payload,
        authData: updatedAuth,
        loading: false,
        error: null,
      };

    case "FETCH_USER_PROFILE_ERROR":
    case "UPDATE_PROFILE_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

export default userReducer;
