import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  ExternalLink,
  LogOut,
  Search,
  User,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

export default function PortalLayout({
  portalType = 'admin', // 'admin' | 'staff'
  portalTitle = 'Admin Portal',
  navItems = [],
  activeTab,
  onTabChange,
  user = null,
  onSignOut,
  children,
  globalSearch = '',
  onGlobalSearchChange,
  headerAction = null,
}) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Close mobile drawer on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('#user-profile-menu')) {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [profileDropdownOpen]);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col font-sans text-[#172033]">
      {/* ─────────────────────────────────────────────────────────────
          1. DARK NAVY SIDEBAR (DESKTOP & DRAWER ON MOBILE)
         ───────────────────────────────────────────────────────────── */}

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#10284B]/60 backdrop-blur-xs lg:hidden animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#10284B] text-white flex flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:w-[76px]' : 'lg:w-[260px]'
        } ${
          mobileMenuOpen
            ? 'translate-x-0 w-[280px]'
            : '-translate-x-full lg:translate-x-0'
        } shadow-xl lg:shadow-none border-r border-[#17365D]`}
      >
        {/* Brand / Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 sm:px-5 border-b border-[#17365D]/80">
          <Link
            to={portalType === 'admin' ? '/admin/dashboard' : '/staff/dashboard'}
            className="flex items-center gap-3 overflow-hidden focus:outline-none"
          >
            <div className="h-9 w-9 rounded-lg bg-white p-1 shrink-0 flex items-center justify-center shadow-xs">
              <img src="/images/logo.png" alt="HKCL" className="h-7 w-7 object-contain" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 text-left">
                <span className="block text-sm font-bold tracking-tight text-white truncate">
                  HKCL Skill Centre
                </span>
                <span className="block text-[11px] font-medium text-slate-300 truncate">
                  {portalTitle}
                </span>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-[#17365D] lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#17365D] text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:bg-[#17365D]/50 hover:text-white'
                } ${sidebarCollapsed ? 'lg:justify-center' : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`h-4.5 w-4.5 shrink-0 ${
                    isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                {!sidebarCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!sidebarCollapsed && typeof item.count === 'number' && (
                  <span
                    className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-amber-400/20 text-amber-300'
                        : 'bg-[#17365D] text-slate-300'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Utility Controls */}
        <div className="p-3 border-t border-[#17365D]/80 space-y-1">
          {/* Public website */}
          <Link
            to="/"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-[#17365D]/60 hover:text-white transition ${
              sidebarCollapsed ? 'lg:justify-center' : ''
            }`}
            title="Return to Public Website"
          >
            <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
            {!sidebarCollapsed && <span className="truncate">Public Website</span>}
          </Link>

          {/* Sign Out */}
          <button
            type="button"
            onClick={onSignOut}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-rose-300 hover:bg-rose-500/20 hover:text-rose-100 transition ${
              sidebarCollapsed ? 'lg:justify-center' : ''
            }`}
            title="Sign Out"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span className="truncate">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CONTENT WRAPPER (HEADER + BODY)
         ───────────────────────────────────────────────────────────── */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:pl-[76px]' : 'lg:pl-[260px]'
        }`}
      >
        {/* Top Header: Clean Institutional White */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E5EAF1] px-4 sm:px-6 flex items-center justify-between gap-4 shadow-xs">
          {/* Left: Mobile hamburger & Collapse toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Desktop collapse toggle */}
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4.5 w-4.5" />
              ) : (
                <PanelLeftClose className="h-4.5 w-4.5" />
              )}
            </button>

            <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-[#718096]">
              {portalTitle}
            </span>
          </div>

          {/* Center: Global Search (if handler provided) */}
          {onGlobalSearchChange && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => onGlobalSearchChange(e.target.value)}
                  placeholder="Quick search records, applicants, ID..."
                  className="h-9 w-full pl-9 pr-3.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs text-[#172033] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#10284B] focus:ring-1 focus:ring-[#10284B] transition-colors"
                />
              </div>
            </div>
          )}

          {/* Right: Custom header action + User profile dropdown */}
          <div className="flex items-center gap-3">
            {headerAction}

            {/* User Profile Menu */}
            <div id="user-profile-menu" className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-50 transition focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-[#10284B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {initials}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="block text-xs font-semibold text-[#172033] leading-tight">
                    {user?.name || 'Authorized User'}
                  </span>
                  <span className="block text-[11px] text-[#718096] capitalize">
                    {user?.designation || user?.role || 'Staff Member'}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-[#E5EAF1] shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-[#172033] truncate">
                      {user?.name}
                    </p>
                    <p className="text-[11px] text-[#718096] truncate">
                      {user?.email}
                    </p>
                    <span className="mt-1 inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {user?.role}
                    </span>
                  </div>

                  <Link
                    to="/"
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    <span>Public Website</span>
                  </Link>

                  <button
                    type="button"
                    onClick={onSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition border-t border-slate-100"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
