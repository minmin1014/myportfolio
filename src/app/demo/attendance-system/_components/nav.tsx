"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Clock,
  Building2,
  FileText,
  Settings,
  LogOut,
  CalendarDays,
  Users,
  UsersRound,
} from "lucide-react";
import { useDemoAttendance } from "@/lib/demo-attendance/store";
import { BackToPortfolioLink } from "./back-to-portfolio-link";

const BASE = "/demo/attendance-system";

const NAV_ITEMS = [
  { href: `${BASE}/dashboard`, label: "ダッシュボード", icon: LayoutDashboard },
  { href: `${BASE}/shifts`, label: "シフト管理", icon: CalendarDays },
  { href: `${BASE}/staff`, label: "講師表", icon: UsersRound },
  { href: `${BASE}/students`, label: "生徒表", icon: Users },
  { href: `${BASE}/attendance`, label: "勤怠一覧", icon: Clock },
  { href: `${BASE}/classrooms`, label: "教室管理", icon: Building2 },
  { href: `${BASE}/reports`, label: "レポート", icon: FileText },
  { href: `${BASE}/settings`, label: "設定", icon: Settings },
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { resetDemo } = useDemoAttendance();

  function handleSignOut() {
    resetDemo();
    router.push("/demo/attendance-system");
  }

  return (
    <aside className="hidden md:flex w-60 min-h-screen bg-white border-r flex-col">
      <div className="p-4 border-b">
        <h1 className="font-bold text-lg leading-tight">
          塾講師
          <br />
          勤怠管理
        </h1>
        <p className="mt-1 text-[11px] text-amber-600">デモ環境（ダミーデータ）</p>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cx(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-2 border-t space-y-1">
        <BackToPortfolioLink />
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 w-full transition-colors"
        >
          <LogOut size={18} />
          サインアウト
        </button>
      </div>
    </aside>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const items = NAV_ITEMS.slice(0, 5);

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t z-50 md:hidden">
      <div className="flex">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cx(
              "flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors",
              pathname === href ? "text-gray-900" : "text-gray-400",
            )}
          >
            <Icon size={20} />
            <span className="text-[10px]">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
