"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DemoAttendanceIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/demo/attendance-system/dashboard");
  }, [router]);

  return null;
}
