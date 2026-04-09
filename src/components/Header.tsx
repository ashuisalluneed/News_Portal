'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import SideMenu from './SideMenu';

/**
 * Premium Header Design with modern styling
 */
export default function Header() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useState('Locating...');
  const [currentDate, setCurrentDate] = useState<string | null>(null);

  const { data: session, status } = useSession();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Initialize date and location
  useEffect(() => {
    // Function to update date and time
    const updateDateTime = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setCurrentDate(`${dateStr} • ${timeStr}`);
    };

    // Initial call
    updateDateTime();

    // Update every minute
    const timer = setInterval(updateDateTime, 60000);

    // Fetch location
    const fetchLocation = async () => {
      try {
        // Try geojs.io first (reliable, free)
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (res.ok) {
          const data = await res.json();
          if (data.city && data.country) {
            setLocation(`${data.city}, ${data.country}`);
            return;
          }
        }
        throw new Error('GeoJS failed');
      } catch (e) {
        // Fallback to ipapi.co
        try {
          const res = await fetch('https://ipapi.co/json/');
          if (res.ok) {
            const data = await res.json();
            if (data.city && data.country_name) {
              setLocation(`${data.city}, ${data.country_name}`);
              return;
            }
          }
        } catch (err) {
          console.warn('Location fetch failed:', err);
          setLocation('New York, USA');
        }
      }
    };

    fetchLocation();

    // Scroll handler
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut({ callbackUrl: '/' });
  };

  const notificationCount = 0;

  return (
    <>
      <SideMenu
        isOpen={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
        notificationCount={notificationCount}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-background-dark/80 backdrop-blur-xl shadow-[0_4px_30px_rgb(0,0,0,0.8)] border-b border-outline/30'
          : 'bg-background-dark border-b border-outline/10'
          }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Top Bar - Premium Features */}
          <div className="hidden lg:flex items-center justify-between px-6 py-2 border-b border-outline/10 text-xs font-medium tracking-wider uppercase">
            <div className="flex items-center gap-6 text-foreground-muted">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>{currentDate || 'Loading...'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
              <Link href="/newsletter" className="text-primary hover:text-primary-variant transition-colors flex items-center gap-1">
                <span>✦</span> Newsletter
              </Link>
              <Link href="/about" className="text-foreground-muted hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-foreground-muted hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Main Header */}
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Menu + Logo */}
              <div className="flex items-center gap-4">
                {/* Hamburger with Badge */}
                <button
                  onClick={() => setSideMenuOpen(true)}
                  className="relative p-2 hover:bg-surface rounded-lg transition-colors group"
                  aria-label="Open menu"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <svg className="w-6 h-6 text-foreground-muted group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-background-dark bg-primary rounded-full shadow-[0_0_10px_rgba(242,202,80,0.5)]">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-variant rounded-lg flex items-center justify-center text-background-dark font-bold text-2xl shadow-[0_0_15px_rgba(242,202,80,0.2)] group-hover:shadow-[0_0_20px_rgba(242,202,80,0.4)] transition-all duration-300" style={{ fontFamily: 'var(--font-heading), serif' }}>
                    N
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-2xl font-black text-foreground tracking-tight" style={{ fontFamily: 'var(--font-heading), serif' }}>
                      NEWS<span className="text-primary italic font-light ml-1">PORTAL</span>
                    </h1>
                    <p className="text-[0.65rem] text-primary/80 tracking-widest uppercase -mt-1 font-semibold">Stay Informed, Stay Ahead</p>
                  </div>
                </Link>
              </div>

              {/* Center: Quick Categories (Desktop) */}
              <nav className="hidden lg:flex items-center gap-1">
                {['Home', 'Technology', 'Business', 'Sports', 'Entertainment'].map((item) => (
                  <Link
                    key={item}
                    href={item === 'Home' ? '/' : `/category/${item.toLowerCase()}`}
                    className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-foreground-muted hover:text-primary hover:bg-surface rounded-lg transition-all duration-300"
                  >
                    {item}
                  </Link>
                ))}
              </nav>

              {/* Right: Search + User */}
              <div className="flex items-center gap-3">
                {/* Search Button */}
                <button
                  className="p-2 hover:bg-surface rounded-lg transition-colors group"
                  aria-label="Search"
                  onClick={() => setSideMenuOpen(true)}
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <svg className="w-5 h-5 text-foreground-muted group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                {/* User Section */}
                {status === 'loading' ? (
                  <div className="w-10 h-10 rounded-full bg-surface-low animate-pulse" />
                ) : session ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-surface rounded-lg transition-colors"
                      style={{ minHeight: '44px' }}
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-variant flex items-center justify-center text-background-dark font-bold text-sm shadow-[0_0_10px_rgba(242,202,80,0.2)]">
                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="hidden md:block text-sm font-semibold text-foreground">
                        {session.user?.name?.split(' ')[0]}
                      </span>
                      <svg
                        className={`hidden md:block w-4 h-4 text-foreground-muted transition-transform duration-300 ${userMenuOpen ? 'rotate-180 text-primary' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* User Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-surface-high rounded-xl shadow-2xl border border-outline/30 py-2 z-50">
                        <div className="px-4 py-3 border-b border-outline/20">
                          <p className="font-semibold text-foreground">{session.user?.name}</p>
                          <p className="text-sm text-foreground-muted truncate">{session.user?.email}</p>
                        </div>
                        <div className="py-2">
                          {session?.user?.role === 'ADMIN' && (
                            <Link href="/admin" className="flex items-center gap-3 px-4 py-2 hover:bg-surface-highest transition-colors group">
                              <svg className="w-5 h-5 text-foreground-muted group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Admin Dashboard</span>
                            </Link>
                          )}
                          <Link href="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-surface-highest transition-colors group">
                            <svg className="w-5 h-5 text-foreground-muted group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">My Profile</span>
                          </Link>
                          <Link href="/saved" className="flex items-center gap-3 px-4 py-2 hover:bg-surface-highest transition-colors group">
                            <svg className="w-5 h-5 text-foreground-muted group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Saved Articles</span>
                          </Link>
                        </div>
                        <div className="border-t border-outline/20 pt-2">
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-500/10 text-red-500 transition-colors group"
                          >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="text-sm font-medium">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/auth/login"
                      className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-foreground hover:text-primary transition-colors"
                      style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="px-5 py-2 text-xs font-bold tracking-widest uppercase text-background-dark bg-primary hover:bg-primary-variant rounded-lg transition-all shadow-[0_4px_14px_0_rgba(242,202,80,0.39)] hover:shadow-[0_6px_20px_rgba(242,202,80,0.23)] hover:-translate-y-0.5"
                      style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
