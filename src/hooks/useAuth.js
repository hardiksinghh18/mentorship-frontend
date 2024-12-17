import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { checkAuth } from '../actions/authActions';

const useAuth = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(checkAuth());
    }
  }, [isLoggedIn, dispatch]);

  return isLoggedIn;
};

export default useAuth;
