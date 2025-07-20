"use client";

import { cn } from "@/lib/utils";
import Logo from "./logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineLightMode } from "react-icons/md";

const routes = [
  {
    label: "Dashboard",
    path: "/app/dashboard",
  },
  {
    label: "Account",
    path: "/app/account",
  },
];

export default function AppHeader() {
  const activePathname = usePathname();

  return (
    <header className="flex justify-between items-center border-b py-2">
      <Logo />
      <nav>
        <ul className="flex gap-2 text-xs">
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                href={route.path}
                className={cn(
                  "rounded-sm px-2 py-1 font:opacity-70 focus:opacity-70 transition",
                  {
                    "bg-black text-white": route.path === activePathname,
                  }
                )}
              >
                {route.label}
              </Link>
            </li>
          ))}
        <MdOutlineLightMode />
        </ul>
      </nav>
    </header>
  );
}
