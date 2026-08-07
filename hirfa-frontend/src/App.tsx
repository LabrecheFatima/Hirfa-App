import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/protected/ProtectedRoute';
import { RoleGuard } from './components/protected/RoleGuard';
import { PageWrapper } from './components/layout/PageWrapper';
import { Role } from './types';

// Pages
import { EventCatalog } from './pages/EventCatalog';
import { MyTickets } from './pages/MyTickets';
import { InstructorEvents } from './pages/InstructorEvents';
import { StaffScanner } from './pages/StaffScanner';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PageWrapper>
              <EventCatalog />
            </PageWrapper>
          }
        />
        <Route
          path="/events"
          element={
            <PageWrapper>
              <EventCatalog />
            </PageWrapper>
          }
        />

        {/* Authenticated Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Attendee Routes */}
          <Route element={<RoleGuard allowedRoles={[Role.ATTENDEE, Role.ORGANISER, Role.ADMIN]} />}>
            <Route
              path="/my-tickets"
              element={
                <PageWrapper showSidebar>
                  <MyTickets />
                </PageWrapper>
              }
            />
          </Route>

          {/* Organiser / Instructor Routes */}
          <Route element={<RoleGuard allowedRoles={[Role.ORGANISER, Role.INSTRUCTOR, Role.ADMIN]} />}>
            <Route
              path="/organiser/events"
              element={
                <PageWrapper showSidebar>
                  <InstructorEvents />
                </PageWrapper>
              }
            />
          </Route>

          {/* Staff Routes */}
          <Route element={<RoleGuard allowedRoles={[Role.STAFF, Role.ORGANISER, Role.ADMIN]} />}>
            <Route
              path="/staff/scanner"
              element={
                <PageWrapper showSidebar>
                  <StaffScanner />
                </PageWrapper>
              }
            />
          </Route>
        </Route>

        {/* Unauthorized / Fallback */}
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