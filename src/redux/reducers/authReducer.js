import { SET_AUTH, LOGOUT } from '../actions/authActions';

const initialState = {
  isLoggedIn: false,
  user: null, // Stores user info (e.g., email) if needed
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH:
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
        user: action.payload.user,
      };

    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };

    default:
      return state;
  }
};
