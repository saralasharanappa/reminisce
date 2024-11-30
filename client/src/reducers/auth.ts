import { AUTH, LOGOUT } from "../constants/actionTypes";

// Define the shape of the state
interface AuthState {
  authData: Record<string, any> | null; // Adjust the shape based on actual `authData`
}

// Define the shape of the actions
interface AuthAction {
  type: string;
  data?: any; // Adjust based on the structure of the action payload
}

const initialState: AuthState = {
  authData: null,
};

const authReducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AUTH:
      localStorage.setItem("profile", JSON.stringify({ ...action?.data }));
      return { ...state, authData: action?.data };
    case LOGOUT:
      localStorage.clear();
      return { ...state, authData: null };
    default:
      return state;
  }
};

export default authReducer;
