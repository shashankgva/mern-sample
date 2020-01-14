import {
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  user: null
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        loading: false,
        isAuthenticated: true
      };
    case REGISTER_FAILURE:
    case AUTH_ERROR:
    case LOGIN_FAILURE:
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        loading: false,
        token: null,
        isAuthenticated: false
      };
    default:
      return state;
  }
};
