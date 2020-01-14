import axios from "../../axios-custom";
import {
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  CLEAR_PROFILE
} from "./types";
import { setAlert } from "./alert";
import setAuthToken from "../../utils/setAuthToken";

//Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get("/api/auth");
    console.log(`User>>>${res}`);

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (error) {
    console.error("user load error", error);

    dispatch({
      type: AUTH_ERROR
    });
  }
};

//Register User
export const register = ({ name, email, password }) => async dispatch => {
  const newUser = {
    name,
    email,
    password
  };

  const body = JSON.stringify(newUser);

  try {
    const res = await axios.post("/api/users", body);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (error) {
    console.error(error);
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: REGISTER_FAILURE
    });
  }
};

//Login User
export const login = ({ email, password }) => async dispatch => {
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/auth", body);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (error) {
    console.error(error);
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: LOGIN_FAILURE
    });
  }
};

//Logout
export const logout = () => dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
