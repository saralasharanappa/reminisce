import { Dispatch } from "redux";
import * as api from "../api";
import { UserProfile } from "../reducers/types";
import { AUTH, LOGOUT } from "../constants/actionTypes";

// Auth actions
export const signin = (formData: any, callback: () => void) => async (dispatch: Dispatch) => {
  try {
    const { data } = await api.signIn(formData);
    dispatch({ type: AUTH, data });
    callback();
  } catch (error) {
    console.log(error);
  }
};

export const signup = (formData: any, callback: () => void) => async (dispatch: Dispatch) => {
  try {
    const { data } = await api.signUp(formData);
    dispatch({ type: AUTH, data });
    callback();
  } catch (error) {
    console.log(error);
  }
};

export const logout = () => (dispatch: Dispatch) => {
  dispatch({ type: LOGOUT });
};

// Profile actions
export const fetchUserProfile = (id: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: "FETCH_USER_PROFILE_LOADING" });
    const { data } = await api.fetchUserProfile(id);
    dispatch({ type: "FETCH_USER_PROFILE", payload: data });
  } catch (error) {
    console.error("Error fetching profile:", error);
    dispatch({
      type: "FETCH_USER_PROFILE_ERROR",
      payload: error.message || "Failed to fetch profile",
    });
  }
};

export const updateUserProfile = 
  (id: string, updatedProfileData: Partial<UserProfile>) => 
  async (dispatch: Dispatch) => {
    try {
      dispatch({ type: "FETCH_USER_PROFILE_LOADING" });
      const { data } = await api.updateUserProfileAPI(id, updatedProfileData);
      
      // Update both profile and auth data
      dispatch({ type: "UPDATE_PROFILE", payload: data });
      
      // Get existing auth data and update it
      const existingAuth = JSON.parse(localStorage.getItem('profile') || '{}');
      const updatedAuth = {
        ...existingAuth,
        result: {
          ...existingAuth.result,
          ...data,
        }
      };
      
      // Dispatch AUTH action to update auth state
      dispatch({ type: AUTH, data: updatedAuth });
      
      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      dispatch({
        type: "UPDATE_PROFILE_ERROR",
        payload: error.message || "Failed to update profile",
      });
      return null;
    }
  };
