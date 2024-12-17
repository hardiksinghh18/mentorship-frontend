import axios from 'axios'; // Direct import of axios

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
    
    await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/logout`,null,{withCredentials:true}); // Backend logout endpoint
 
    dispatch(logout());
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
