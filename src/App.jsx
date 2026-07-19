import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { LoadingSpinner } from './components/common/Misc';

import Home from './pages/Home';
import DarshanGuide from './pages/DarshanGuide';
import TempleDetail from './pages/TempleDetail';
import DarshanRoutes from './pages/DarshanRoutes';
import GuesthouseInfo from './pages/GuesthouseInfo';
import EmergencyContacts from './pages/EmergencyContacts';
import NotFound from './pages/NotFound';

// The Admin Panel (and its Firebase Storage / editing dependencies) is
// only ever needed by guesthouse staff, not by guests scanning the QR
// code, so it is split into its own lazily-loaded chunk.
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const TempleEditor = lazy(() => import('./pages/admin/TempleEditor'));
const RoutesEditor = lazy(() => import('./pages/admin/RoutesEditor'));
const GuesthouseEditor = lazy(() => import('./pages/admin/GuesthouseEditor'));
const ContactsEditor = lazy(() => import('./pages/admin/ContactsEditor'));

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner label="Loading admin panel…" />}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/darshan-guide" element={<DarshanGuide />} />
                <Route path="/darshan-guide/:templeId" element={<TempleDetail />} />
                <Route path="/darshan-routes" element={<DarshanRoutes />} />
                <Route path="/guesthouse-info" element={<GuesthouseInfo />} />
                <Route path="/emergency-contacts" element={<EmergencyContacts />} />
              </Route>

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/temples/new" element={<TempleEditor />} />
                  <Route path="/admin/temples/:templeId" element={<TempleEditor />} />
                  <Route path="/admin/routes" element={<RoutesEditor />} />
                  <Route path="/admin/guesthouse" element={<GuesthouseEditor />} />
                  <Route path="/admin/contacts" element={<ContactsEditor />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
