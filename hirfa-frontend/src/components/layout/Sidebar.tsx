import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types';

export const Sidebar: React.FC = () => {
  const { roles } = useAuth();

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
      isActive
        ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs'
        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
    }`;

  return (
    <aside className="w-64 border-r border-slate-200/80 bg-white p-4 min-h-[calc(100vh-4rem)]">
      <nav className="flex flex-col gap-1">
        <div className="px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Main Menu
        </div>
        <NavLink to="/events" className={navItemClass}>
          Browse Events
        </NavLink>

        {/* Hide ticket wallet link for Staff members */}
        {!roles.includes(Role.STAFF) && (
          <NavLink to="/my-tickets" className={navItemClass}>
            My Tickets
          </NavLink>
        )}

        {roles.includes(Role.ORGANISER) && (
          <>
            <div className="mt-6 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Instructor Portal
            </div>
            <NavLink to="/organiser/events" className={navItemClass}>
              Organiser Dashboard
            </NavLink>
          </>
        )}

        {roles.includes(Role.STAFF) && (
          <>
            <div className="mt-6 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
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