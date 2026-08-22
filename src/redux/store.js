import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './reducers/authReducer';
import uiReducer from './reducers/uiReducer';
import apiSlice from './api/apiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
