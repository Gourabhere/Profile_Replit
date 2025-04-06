import React from "react";
import { Link, useLocation } from "wouter";
import { Home, Search, Bookmark, User } from "lucide-react";

export function BottomNavigation() {
  const [location] = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/search", label: "Search", icon: Search },
    { path: "/saved", label: "Saved", icon: Bookmark },
    { path: "/profile", label: "Profile", icon: User }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="grid grid-cols-4 h-14">
        {navItems.map((item) => {
          const isActive = item.path === location;
          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center justify-center"
            >
              <item.icon
                className={`h-5 w-5 ${isActive ? "text-primary" : "text-gray-400"}`}
              />
              <span
                className={`text-xs mt-1 ${isActive ? "text-primary font-medium" : "text-gray-500"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
