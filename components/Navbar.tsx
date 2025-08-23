"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/is-authenticated");
        if (!res.ok) return;
        const data = await res.json();
        if (data?.isAuthenticated) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
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
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      {/* Logo / Profile */}
      <Link href="/profile" className="text-xl font-bold">
        Profile
      </Link>

      <div className="flex gap-6 items-center">
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
          <>
            
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm"
            >
              Logout
            </button>
          </>
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
    </nav>
  );
}
