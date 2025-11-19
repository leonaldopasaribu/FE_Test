import { Navigate, Outlet } from 'react-router';
import { SIGN_IN_ROUTE_URL } from '../../constants/route-url.constant';

export default function ProtectedRoute() {
  const hasToken = localStorage.getItem('authToken');

  if (!hasToken) {
    return <Navigate to={SIGN_IN_ROUTE_URL} replace />;
  }

  return <Outlet />;
}
