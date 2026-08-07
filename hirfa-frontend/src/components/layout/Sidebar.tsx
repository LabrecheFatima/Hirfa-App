import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types';

export const Sidebar: React.FC = () => {
  const { roles } = useAuth();

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-50 text-indigo-600'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-4 min-h-[calc(100vh-4rem)]">
      <nav className="flex flex-col gap-1">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Main Menu
        </div>
        <NavLink to="/events" className={navItemClass}>
          Browse Events
        </NavLink>
        <NavLink to="/my-tickets" className={navItemClass}>
          My Tickets
        </NavLink>

        {roles.includes(Role.ORGANISER) && (
          <>
            <div className="mt-6 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Instructor Portal
            </div>
            <NavLink to="/instructor/events" className={navItemClass}>
              Manage Events
            </NavLink>
            <NavLink to="/instructor/events/new" className={navItemClass}>
              Create Event
            </NavLink>
          </>
        )}

        {roles.includes(Role.STAFF) && (
          <>
            <div className="mt-6 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Staff Portal
            </div>
            <NavLink to="/staff/scanner" className={navItemClass}>
              QR Ticket Scanner
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};