"use client";

import { useDemoAttendance } from "@/lib/demo-attendance/store";
import { SignInScreen } from "./sign-in-screen";
import { SideNav, BottomNav } from "./nav";

export function DemoGate({ children }: { children: React.ReactNode }) {
  const { ready, isSignedIn } = useDemoAttendance();

  if (!ready) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  if (!isSignedIn) {
    return <SignInScreen />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNav />
      <main className="flex-1 overflow-auto pb-16 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
