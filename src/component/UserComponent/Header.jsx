import { useAuth } from "../GlobalComponent/AuthProvider";
import { useState, useEffect, useRef, useCallback } from "react";
import NotificationBell from "../NotificationComponent/NotificationBell";
import { Link, useLocation } from "react-router-dom";
import {
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  CalendarIcon,
  ChevronDownIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import Searchbar from "../Common/Searchbar";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    setIsOpen(false);
  }, [logout]);

  if (!isAuthenticated) {
    return (
      <Link
        to="/auth/login"
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 
                 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold 
                 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl
                 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 hover:bg-white/10 rounded-xl transition-all 
        duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        <div
          className="h-10 w-10 bg-gradient-to-br from-blue-400 to-purple-500 
          rounded-xl flex items-center justify-center text-white font-semibold"
        >
          {user.fullname
            ?.split(" ")
            ?.map((n) => n[0])
            ?.join("") || "U"}
        </div>
        <div
          className={`text-white transition-transform duration-200 hidden sm:block${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <ChevronDownIcon />
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl bg-white 
                       shadow-2xl ring-1 ring-black/5 z-50 backdrop-blur-xl border border-gray-100"
        >
          <div className="p-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
              <div
                className="h-12 w-12 bg-gradient-to-br from-blue-400 to-purple-500 
                            rounded-xl flex items-center justify-center text-white font-semibold"
              >
                {user.fullname
                  ?.split(" ")
                  ?.map((n) => n[0])
                  ?.join("") || "U"}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {user.fullname || "User"}
                </p>
                <p className="text-xs text-gray-500">{user.email || "No email"}</p>
                <span
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs 
                               font-medium bg-blue-100 text-blue-800 capitalize mt-1"
                >
                  User
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                onClick={() => {
                  console.log("Navigate to profile");
                  setIsOpen(false);
                }}
                to={"/profile"}
                className="flex items-center w-full px-3 py-3 text-sm text-gray-700 
                         hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 
                         rounded-xl transition-all duration-200 group"
              >
                <div className="text-gray-400 mr-3 group-hover:text-blue-500">
                  <UserIcon />
                </div>
                <span className="font-medium">Your Profile</span>
              </Link>

              <Link
                onClick={() => {
                  setIsOpen(false);
                }}
                to={"/booking-details"}
                className="flex items-center w-full px-3 py-3 text-sm text-gray-700 
                         hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 
                         rounded-xl transition-all duration-200 group"
              >
                <div className="text-gray-400 mr-3 group-hover:text-blue-500">
                  <CalendarIcon />
                </div>
                <span className="font-medium">Your Bookings</span>
              </Link>

              <button
                onClick={() => {
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-3 py-3 text-sm text-gray-700 
                         hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 
                         rounded-xl transition-all duration-200 group"
              >
                <div className="text-gray-400 mr-3 group-hover:text-blue-500">
                  <SettingsIcon />
                </div>
                <span className="font-medium">Settings</span>
              </button>
            </div>

            <div className="border-t border-gray-100 pt-2 mt-2">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-3 text-sm text-red-600 
                         hover:bg-red-50 rounded-xl transition-all duration-200 group"
              >
                <div className="text-red-400 mr-3 group-hover:text-red-600">
                  <LogOutIcon />
                </div>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Header Component
const ModernHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const role = useState(localStorage.getItem("role"));
  const location = useLocation();
  const { auth, isAuthenticated } = useAuth();

  const navigation = [
    {
      name: "Home",
      href: role === "doctor" ? "/doctor-dashboard" : "/",
      current:
        location.pathname === "/" || location.pathname === "/doctor-dashboard",
    },
    {
      name: "About Us",
      href: "/about",
      current: location.pathname === "/about",
    },
    {
      name: "Contact Us",
      href: "/contact",
      current: location.pathname === "/contact",
    },
  ];

  return (
    <header
      className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 
      shadow-2xl border-b border-slate-700/50 top-0 z-50 backdrop-blur-xl relative"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-gray-300 
            hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 
            focus:ring-white/20 transition-all duration-200"
            >
              {!isMobileMenuOpen ? <MenuIcon /> : <XIcon />}
            </button>
          </div>

          {/* Logo */}
          <div className="hidden sm:flex items-center justify-start">
            <Link to={"/"} className="flex items-center group">
              <div
                className="h-12 w-12 bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 
                rounded-2xl flex items-center justify-center group-hover:scale-105 
                transition-all duration-200 shadow-lg"
              >
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <div className="ml-3 hidden lg:block">
                <span
                  className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 
                  bg-clip-text text-transparent"
                >
                  HeyDoctor
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex  ">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 text-sm font-semibold transition-all duration-200 
                border-b-2 border-transparent hover:border-blue-400 hover:text-white
                ${
                  item.current
                    ? "text-white border-b-2 border-blue-400"
                    : "text-gray-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <Searchbar />
          </div>

          {/* Right side icons */}
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <Link to={"/notifications"}>
                <NotificationBell />
              </Link>
            </div>
          )}
          <ProfileDropdown />
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <Searchbar />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700/50 mt-4">
            <div className="space-y-2 px-4 pb-6 pt-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block w-full text-left rounded-xl px-4 py-3 text-base font-medium 
                  transition-all duration-200 ${
                    item.current
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ModernHeader;
