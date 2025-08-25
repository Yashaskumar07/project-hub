"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; // hamburger & close icons
import { FaUserCircle } from 'react-icons/fa'

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // mobile menu toggle
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/is-authenticated");
        if (!res.ok) return;
        const data = await res.json();
        setIsLoggedIn(!!data?.isAuthenticated);
      } catch (err) {
        console.error("Failed to check authentication", err);
      }
    })();
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0; path=/;";
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  // Hide navbar on auth pages
  const hiddenPaths = ["/login", "/register"];
  if (hiddenPaths.includes(pathname)) return null;

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo / Profile */}
       <Link href="/profile" passHref>
      <div className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-red-600 ">
        <FaUserCircle className="text-3xl" />
        <span>Profile</span>
      </div>
    </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link
            href="/home"
            className={`hover:underline ${
              pathname === "/dash" ? "font-semibold underline" : ""
            }`}
          >
            home
          </Link>
          <Link
            href="/dash"
            className={`hover:underline ${
              pathname === "/dash" ? "font-semibold underline" : ""
            }`}
          >
            Projects
          </Link>

          <Link
            href="/upload"
            className={`hover:underline ${
              pathname === "/upload" ? "font-semibold underline" : ""
            }`}
          >
            Upload Project
          </Link>

          <Link
            href="/search"
            className={`hover:underline ${
              pathname === "/search" ? "font-semibold underline" : ""
            }`}
          >
            Search
          </Link>

          {/* Auth Links */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className={`hover:underline ${
                pathname === "/login" ? "font-semibold underline" : ""
              }`}
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="flex flex-col mt-4 gap-4 md:hidden bg-blue-700 rounded-lg p-4">
          <Link
            href="/dash"
            onClick={() => setIsOpen(false)}
            className={`hover:underline ${
              pathname === "/dash" ? "font-semibold underline" : ""
            }`}
          >
            Projects
          </Link>

          <Link
            href="/upload"
            onClick={() => setIsOpen(false)}
            className={`hover:underline ${
              pathname === "/upload" ? "font-semibold underline" : ""
            }`}
          >
            Upload Project
          </Link>

          <Link
            href="/search"
            onClick={() => setIsOpen(false)}
            className={`hover:underline ${
              pathname === "/search" ? "font-semibold underline" : ""
            }`}
          >
            Search
          </Link>

          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className={`hover:underline ${
                pathname === "/login" ? "font-semibold underline" : ""
              }`}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
