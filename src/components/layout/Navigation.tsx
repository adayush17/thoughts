"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { User } from "@prisma/client";

interface NavigationProps {
  user?: User;
}

export default function Navigation({ user }: NavigationProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-600">
                Jazbaat
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/")
                    ? "border-green-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Home
              </Link>
              {session?.user && (
                <>
                  <Link
                    href="/feed"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive("/feed")
                        ? "border-green-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Feed
                  </Link>
                  <Link
                    href="/categories"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive("/categories")
                        ? "border-green-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Categories
                  </Link>
                  <Link
                    href="/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive("/dashboard")
                        ? "border-green-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <SearchBar />
            </div>
          </div>

          <div className="flex items-center">
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/write"
                  className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Write
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded-full" />
                    )}
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-lg border border-gray-200 hidden group-hover:block">
                    {session.user.id && (
                      <Link
                        href={`/profile/${session.user.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Profile
                      </Link>
                    )}
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 