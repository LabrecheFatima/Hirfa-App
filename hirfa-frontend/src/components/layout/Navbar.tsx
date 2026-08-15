import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { authenticated, user, login, register, logout, roles } = useAuth();
  const location = useLocation();

  const isStaff = roles.map((r) => r.toUpperCase()).includes('STAFF');
  const displayRole =
    roles.find((r) => ['ATTENDEE', 'ORGANISER', 'ORGANIZER', 'STAFF'].includes(r.toUpperCase())) || 'User';

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Nav Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center group">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:opacity-90 transition-opacity">
              Hirfa <span className="text-emerald-600 italic font-serif font-bold">Platform</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/courses"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                isActive('/courses') || isActive('/events')
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              Explore Events
            </Link>

            {/* Show My Tickets only to Non-Staff users */}
            {authenticated && !isStaff && (
              <Link
                to="/my-tickets"
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isActive('/my-tickets')
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                My Tickets
              </Link>
            )}
          </nav>
        </div>

        {/* User Profile & Auth Actions */}
        <div className="flex items-center gap-4">
          {authenticated ? (
            <div className="flex items-center gap-4">
              <div className="text-right text-xs hidden sm:block">
                <p className="font-semibold text-slate-900">
                  {user?.name || user?.email}
                </p>
                <span className="inline-block px-2 py-0.5 mt-0.5 text-[10px] font-bold tracking-wider text-emerald-800 bg-emerald-100 rounded-full uppercase">
                  {displayRole.toLowerCase()}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-xs px-3 py-1.5"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={login}
                className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs"
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                onClick={register}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm"
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};