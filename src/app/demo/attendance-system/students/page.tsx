"use client";

import { useState } from "react";
import { useDemoAttendance } from "@/lib/demo-attendance/store";
import { STANDARD_SLOTS } from "@/lib/demo-attendance/seed";
import { Badge, Card, CardContent } from "../_components/ui";

const WEEKDAYS_JP = ["日", "月", "火", "水", "木", "金", "土"];

export default function DemoStudentsPage() {
  const { classrooms, students } = useDemoAttendance();
  const [classroomId, setClassroomId] = useState(classrooms[0]?.id ?? "");

  const visible = students.filter((s) => s.classroomId === classroomId);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">生徒表</h1>

      <div className="flex gap-2">
        {classrooms.map((c) => (
          <button
            key={c.id}
            onClick={() => setClassroomId(c.id)}
            className={
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors " +
              (classroomId === c.id
                ? "bg-gray-900 text-white"
                : "border border-gray-300 text-gray-600 hover:bg-gray-100")
            }
          >
            {c.name}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="py-2 pr-4 font-medium">生徒名</th>
                  <th className="py-2 pr-4 font-medium">学年</th>
                  <th className="py-2 pr-4 font-medium">曜日</th>
                  <th className="py-2 font-medium">コマ</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((s) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="py-2.5 pr-4 font-medium">{s.name}</td>
                    <td className="py-2.5 pr-4">
                      <Badge variant="outline">{s.grade}</Badge>
                    </td>
                    <td className="py-2.5 pr-4 text-gray-600">{WEEKDAYS_JP[s.dayOfWeek]}曜日</td>
                    <td className="py-2.5 text-gray-600">
                      第{s.slotNumber}コマ（{STANDARD_SLOTS[s.slotNumber - 1]?.start}〜
                      {STANDARD_SLOTS[s.slotNumber - 1]?.end}）
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {visible.length === 0 && (
            <p className="py-4 text-sm text-gray-500">この教室に登録されている生徒はいません。</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
