/**
 * src/components/navbar/UserMenu.jsx
 * Authenticated user dropdown — avatar, name, navigation, logout.
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../store/authStore.jsx';

/* ─────────────────────────────────────────────
   AVATAR — initials circle
───────────────────────────────────────────── */

function Avatar({ name }) {
  const initials = name
    ? name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent text-primary-bg text-xs font-bold select-none">
      {initials}
    </div>
  );
}

/* ─────────────────────────────────────────────
   USER MENU
───────────────────────────────────────────── */

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handle(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [open]);

  function handleNavigateToDashboard() {
    setOpen(false);
    navigate(user.role === 'admin' ? '/admin' : '/dashboard');
  }

  function handleLogout() {
    setOpen(false);
    logout();
    navigate('/');
  }

  if (!user) return null;

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-border px-3 py-1.5 text-sm font-medium text-text-secondary hover:border-accent/40 hover:text-white transition-colors"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Avatar name={user.name} />
        <span className="hidden sm:block max-w-[120px] truncate">{user.name}</span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-[#0E0E14] py-1.5 shadow-xl shadow-black/50 z-50"
          style={{ animation: 'dropdownIn 0.15s ease-out' }}
          role="menu"
        >
          {/* User info header */}
          <div className="px-4 py-2.5 border-b border-border">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-text-quaternary truncate">{user.email}</p>
          </div>

          {/* Mi cuenta (placeholder) */}
          <button
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <User className="h-4 w-4 flex-shrink-0" />
            Mi cuenta
          </button>

          {/* Panel */}
          <button
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
            role="menuitem"
            onClick={handleNavigateToDashboard}
          >
            <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
            Mi panel
          </button>

          {/* Divider */}
          <div className="my-1 border-t border-border" />

          {/* Cerrar sesión */}
          <button
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            role="menuitem"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            Cerrar sesión
          </button>
        </div>
      )}

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
