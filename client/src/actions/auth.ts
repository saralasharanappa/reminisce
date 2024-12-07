import { Dispatch } from "redux";
import { AUTH } from "../constants/actionTypes";
import * as api from "../api/index";

interface FormData {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export const signin =
  (formData: FormData, callback: () => void) => async (dispatch: Dispatch) => {
    try {
      const { data } = await api.signIn(formData);
      dispatch({ type: AUTH, data });
      localStorage.setItem("profile", JSON.stringify(data));
      callback();
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

export const signup =
  (formData: FormData, callback: () => void) => async (dispatch: Dispatch) => {
    try {
      const { data } = await api.signUp(formData);
      dispatch({ type: AUTH, data });
      localStorage.setItem("profile", JSON.stringify(data));
      callback();
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };
