import React from 'react';
import { Link, Navigate } from 'react-router-dom'; 
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types';

export const LandingPage: React.FC = () => {
  const { authenticated, roles } = useAuth();

  // Redirect staff members directly to the scanner page
  if (authenticated && roles.includes(Role.STAFF)) {
    return <Navigate to="/staff/scanner" replace />;
  }

  const isOrganiser = authenticated && roles.includes(Role.ORGANISER);

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
        Master Real Skills with <span className="text-indigo-600">Hirfa Platform</span>
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-600">
        Hands-on artisanal and technical workshops. Book passes, manage attendance, and receive QR check-ins seamlessly.
      </p>
      <div className="mt-8 flex items-center justify-center gap-4">
        {/* Single button for Attendees and Unauthenticated Guests */}
        <Link to="/courses">
          <Button>Explore Catalog</Button>
        </Link>

        {/* Second button rendered ONLY for Organisers */}
        {isOrganiser && (
          <Link to="/organiser/events">
            <Button variant="outline">Organiser Dashboard</Button>
          </Link>
        )}
      </div>
    </div>
  );
};