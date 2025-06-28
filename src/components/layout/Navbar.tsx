"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">
                Jazbaat
              </span>
            </Link>
          </div>

          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/write"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Write
                </Link>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign out
                </button>
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="h-8 w-8 rounded-full"
                  />
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
