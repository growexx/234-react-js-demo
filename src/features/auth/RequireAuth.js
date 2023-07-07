import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectCurrentToken } from './authSlice';

const RequireAuth = () => {
  const token = localStorage.getItem('token'); // useSelector(selectCurrentToken);
  const location = useLocation();
  console.log('token :: ', token)

  return token ? (
    <Outlet data-testid="child-component" />
  ) : (
    <Navigate data-testid="navigate-component" to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
