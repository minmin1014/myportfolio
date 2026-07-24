"use client";

import { Plus } from "lucide-react";
import { useDemoAttendance } from "@/lib/demo-attendance/store";
import { seedPlannedShifts } from "@/lib/demo-attendance/seed";
import { formatMonthDay } from "@/lib/demo-attendance/format";
import { Badge, Button, Card, CardContent } from "../_components/ui";

const WEEKDAYS_JP = ["日", "月", "火", "水", "木", "金", "土"];

export default function DemoShiftsPage() {
  const { classrooms } = useDemoAttendance();
  const classroomName = (id: string) => classrooms.find((c) => c.id === id)?.name ?? "―";
  const shifts = seedPlannedShifts();

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">シフト管理</h1>
        <Button size="sm" disabled title="このデモでは登録できません">
          <Plus size={16} />
          シフトを登録
        </Button>
      </div>
      <p className="text-xs text-gray-400">
        表示されている予定はすべてダミーデータです。このデモではシフトの新規登録・編集はできません。
      </p>

      <div className="space-y-2">
        {shifts.map((shift) => {
          const d = new Date(`${shift.workDate}T00:00:00`);
          return (
            <Card key={shift.id}>
              <CardContent className="flex items-center justify-between pt-4">
                <div>
                  <p className="font-medium">
                    {formatMonthDay(shift.workDate)}
                    <span className="ml-2 text-sm text-gray-500">
                      {WEEKDAYS_JP[d.getDay()]}曜日
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {classroomName(shift.classroomId)} ・ {shift.slotCount}コマ ・ {shift.timeBand}
                  </p>
                </div>
                {shift.isOpeningDuty && (
                  <Badge variant="outline" className="border-amber-400 text-amber-700">
                    開け担当
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
