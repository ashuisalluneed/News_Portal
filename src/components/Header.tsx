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
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white shadow-sm'
          }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Top Bar - Premium Features */}
          <div className="hidden lg:flex items-center justify-between px-6 py-2 border-b border-gray-100 text-sm">
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>{currentDate || 'Loading...'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/newsletter" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                📧 Newsletter
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
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
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Open menu"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:shadow-lg transition-shadow">
                    N
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                      NEWS<span className="text-blue-600">PORTAL</span>
                    </h1>
                    <p className="text-xs text-gray-500 -mt-1">Stay Informed, Stay Ahead</p>
                  </div>
                </Link>
              </div>

              {/* Center: Quick Categories (Desktop) */}
              <nav className="hidden lg:flex items-center gap-1">
                {['Home', 'Technology', 'Business', 'Sports', 'Entertainment'].map((item) => (
                  <Link
                    key={item}
                    href={item === 'Home' ? '/' : `/category/${item.toLowerCase()}`}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </nav>

              {/* Right: Search + User */}
              <div className="flex items-center gap-3">
                {/* Search Button */}
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Search"
                  onClick={() => setSideMenuOpen(true)}
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                {/* User Section */}
                {status === 'loading' ? (
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                ) : session ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                      style={{ minHeight: '44px' }}
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="hidden md:block text-sm font-medium text-gray-700">
                        {session.user?.name?.split(' ')[0]}
                      </span>
                      <svg
                        className={`hidden md:block w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* User Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900">{session.user?.name}</p>
                          <p className="text-sm text-gray-500 truncate">{session.user?.email}</p>
                        </div>
                        <div className="py-2">
                          <Link href="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">My Profile</span>
                          </Link>
                          <Link href="/saved" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Saved Articles</span>
                          </Link>
                        </div>
                        <div className="border-t border-gray-100 pt-2">
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="text-sm font-medium">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/auth/login"
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm hover:shadow"
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
