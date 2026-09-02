import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/protected/ProtectedRoute';
import { RoleGuard } from './components/protected/RoleGuard';
import { PageWrapper } from './components/layout/PageWrapper';
import { Role } from './types';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { CourseCatalog } from './pages/public/CourseCatalog';

// Attendee Pages
import { MyTickets } from './pages/attendee/MyTickets';

// Organizer Pages
import { CourseManagement } from './pages/organizer/CourseManagement';

// Staff Pages
import { QRScanner } from './pages/staff/QRScanner';

export function App() {
  return (
    <BrowserRouter basename="/Hirfa-App">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PageWrapper>
              <LandingPage />
            </PageWrapper>
          }
        />
        <Route
          path="/events"
          element={
            <PageWrapper>
              <CourseCatalog />
            </PageWrapper>
          }
        />
        <Route
          path="/courses"
          element={
            <PageWrapper>
              <CourseCatalog />
            </PageWrapper>
          }
        />

        {/* Authenticated Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Attendee Routes */}
          <Route element={<RoleGuard allowedRoles={[Role.ATTENDEE, Role.ORGANISER]} />}>
            <Route
              path="/my-tickets"
              element={
                <PageWrapper showSidebar>
                  <MyTickets />
                </PageWrapper>
              }
            />
          </Route>

          {/* Organiser Routes */}
          <Route element={<RoleGuard allowedRoles={[Role.ORGANISER]} />}>
            <Route
              path="/organiser/events"
              element={
                <PageWrapper showSidebar>
                  <CourseManagement />
                </PageWrapper>
              }
            />
          </Route>

          {/* Staff Routes */}
          <Route element={<RoleGuard allowedRoles={[Role.STAFF, Role.ORGANISER]} />}>
            <Route
              path="/staff/scanner"
              element={
                <PageWrapper showSidebar>
                  <QRScanner />
                </PageWrapper>
              }
            />
          </Route>
        </Route>

        {/* Fallback */}
        <Route
          path="/unauthorized"
          element={
            <PageWrapper>
              <div className="text-center py-20">
                <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
                <p className="mt-2 text-gray-600">You do not have permission to view this page.</p>
              </div>
            </PageWrapper>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;