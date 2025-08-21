"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/upload", label: "Upload Project" },
    { href: "/search", label: "Search" },
    { href: "/auth/login", label: "Login" },
  ];

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      {/* Redirects to Profile instead of Home */}
      <Link href="/profile" className="text-xl font-bold">👤 Profile</Link>

      <div className="flex gap-6">
        {links.map(link => (
          <Link 
            key={link.href} 
            href={link.href}
            className={`hover:underline ${pathname === link.href ? "font-semibold underline" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
