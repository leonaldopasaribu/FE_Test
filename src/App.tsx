import { BrowserRouter as Router, Routes, Route } from 'react-router';

import { ScrollToTop } from './components/common/ScrollToTop';
import SignIn from './pages/signin/SigIn';
import NotFound from './pages/not-found/NotFound';
import AppLayout from './layout/AppLayout';
import Dashboard from './pages/dashboard/Dashboard';
import GateMaster from './pages/gate-master/GateMaster';
import ProtectedRoute from './components/auth/ProtectedRoute';
import {
  DASHBOARD_ROUTE_URL,
  GATE_MASTER_ROUTE_URL,
  SIGN_IN_ROUTE_URL,
} from './constants/route-url.constant';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index path={DASHBOARD_ROUTE_URL} element={<Dashboard />} />
            <Route path={GATE_MASTER_ROUTE_URL} element={<GateMaster />} />
          </Route>
        </Route>

        {/* Public Routes */}
        <Route path={SIGN_IN_ROUTE_URL} element={<SignIn />} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
