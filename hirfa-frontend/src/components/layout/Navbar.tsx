import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { authenticated, user, login, logout, roles } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            Hirfa Platform
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
            <Link to="/events" className="hover:text-indigo-600 transition-colors">
              Explore Events
            </Link>
            {authenticated && (
              <Link to="/my-tickets" className="hover:text-indigo-600 transition-colors">
                My Tickets
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {authenticated ? (
            <div className="flex items-center gap-4">
              <div className="text-right text-xs hidden sm:block">
                <p className="font-semibold text-gray-900">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email}
                </p>
                <p className="text-gray-500 capitalize">{roles[0] || 'User'}</p>
              </div>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button variant="primary" onClick={login}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};