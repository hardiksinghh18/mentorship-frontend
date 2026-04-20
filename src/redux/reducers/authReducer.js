import { SET_AUTH, LOGOUT } from '../actions/authActions';

const initialState = {
  isLoggedIn: false,
  isChecking: true,
  user: null, 
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH:
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
        isChecking: false,
        user: action.payload.user,
      };

    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        isChecking: false,
        user: null,
      };

    default:
      return state;
  }
};
