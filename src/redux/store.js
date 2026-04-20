import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';

import { combineReducers } from 'redux';
import { authReducer } from './reducers/authReducer';
import uiReducer from './reducers/uiReducer';

// Combine reducers (add more as needed)
const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
});

// Create Redux store with middleware
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
