import axios from 'axios';
import apiSlice from '../api/apiSlice';

export const SET_AUTH = 'SET_AUTH';
export const LOGOUT = 'LOGOUT';

// Action to set authentication state
export const setAuth = (isLoggedIn, user = null) => ({
  type: SET_AUTH,
  payload: { isLoggedIn, user },
});

// Action to logout
export const logout = () => ({
  type: LOGOUT,
});

// Thunk to check authentication
export const setLoggedIn = () => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/verify-tokens`, { withCredentials: true }); // API to verify tokens
    if (response.data.loggedIn) {
      dispatch(setAuth(true, response.data.user));
      dispatch(apiSlice.util.resetApiState()); // Reset RTK Query cache on login
    } else {
      dispatch(setAuth(false));
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    dispatch(setAuth(false));
  }
};

// Thunk to log out the user
export const setLoggedOut = () => async (dispatch) => {
  try {
    await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/logout`, null, { withCredentials: true }); // Backend logout endpoint
    dispatch(logout());
    dispatch(apiSlice.util.resetApiState()); // Reset RTK Query cache on logout
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
