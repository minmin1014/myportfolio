import type { Metadata } from "next";
import "./demo.css";
import { DemoAttendanceProvider } from "@/lib/demo-attendance/store";
import { DemoGate } from "./_components/demo-gate";

export const metadata: Metadata = {
  title: "塾講師勤怠管理（デモ） | Takumi Ishii Portfolio",
  description:
    "個別指導塾向け勤怠管理・生徒管理システムのUIデモ（ポートフォリオ内で完結するダミーデータ版）",
  robots: { index: false, follow: false },
};

export default function DemoAttendanceRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full bg-gray-50 text-gray-900 antialiased">
        <DemoAttendanceProvider>
          <DemoGate>{children}</DemoGate>
        </DemoAttendanceProvider>
      </body>
    </html>
  );
}
