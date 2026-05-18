"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navInnerClass } from "@/lib/ui";

const links = [
  { href: "/", label: "Home", icon: "🌿" },
  { href: "/stats", label: "Stats", icon: "📊" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-sage-200/80 bg-cream/95 backdrop-blur-md supports-[backdrop-filter]:bg-cream/90"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className={navInnerClass}>
        {links.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-[3rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors sm:min-h-[3.25rem] sm:gap-1 sm:text-sm ${
                active
                  ? "bg-sage-100 text-sage-800"
                  : "text-stone-500 hover:text-sage-700 active:bg-sage-50"
              }`}
            >
              <span className="text-lg leading-none sm:text-xl" aria-hidden>
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
