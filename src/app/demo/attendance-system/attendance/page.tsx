"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useDemoAttendance } from "@/lib/demo-attendance/store";
import { formatMonthDay } from "@/lib/demo-attendance/format";
import { Badge, Button, Card, CardContent } from "../_components/ui";

export default function DemoAttendanceListPage() {
  const { entries, classrooms, clockOut } = useDemoAttendance();
  const classroomName = (id: string) => classrooms.find((c) => c.id === id)?.name ?? "―";

  const sorted = [...entries].sort((a, b) => b.workDate.localeCompare(a.workDate));
  const totalSlots = entries.reduce((sum, e) => sum + e.slotCount, 0);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">勤怠一覧</h1>
        <Link href="/demo/attendance-system/attendance/new">
          <Button size="sm">
            <Plus size={16} />
            手動でコマを追加
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="flex gap-6 pt-4 text-sm">
          <div>
            <span className="text-gray-500">記録件数</span>{" "}
            <span className="font-bold">{entries.length}件</span>
          </div>
          <div>
            <span className="text-gray-500">合計</span>{" "}
            <span className="font-bold">{totalSlots}コマ</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {sorted.length === 0 ? (
          <p className="text-sm text-gray-500">勤怠記録がありません</p>
        ) : (
          sorted.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="flex items-center justify-between pt-4">
                <div>
                  <p className="font-medium">
                    {formatMonthDay(entry.workDate)}
                    <span className="ml-2 text-sm text-gray-500">
                      {classroomName(entry.classroomId)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {entry.slotCount}コマ ・ {entry.timeBand}
                  </p>
                </div>
                {entry.checkOutAt ? (
                  <Badge variant="outline">退勤済</Badge>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge>勤務中</Badge>
                    <Button size="sm" variant="outline" onClick={() => clockOut(entry.id)}>
                      退勤する
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
