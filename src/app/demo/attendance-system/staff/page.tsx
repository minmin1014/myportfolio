"use client";

import { useDemoAttendance } from "@/lib/demo-attendance/store";
import { DEMO_STAFF } from "@/lib/demo-attendance/seed";
import { Badge, Card, CardContent } from "../_components/ui";

const WEEKDAYS_JP = ["日", "月", "火", "水", "木", "金", "土"];

export default function DemoStaffPage() {
  const { classrooms } = useDemoAttendance();
  const classroomName = (id: string) => classrooms.find((c) => c.id === id)?.name ?? "―";

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">講師表</h1>
      <p className="text-xs text-gray-400">
        表示されている講師名・シフトはすべてダミーデータです。
      </p>

      <Card>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="py-2 pr-4 font-medium">講師名</th>
                  <th className="py-2 pr-4 font-medium">担当教室</th>
                  <th className="py-2 pr-4 font-medium">曜日</th>
                  <th className="py-2 pr-4 font-medium">時間帯</th>
                  <th className="py-2 font-medium">開け担当</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_STAFF.map((s) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="py-2.5 pr-4 font-medium">{s.name}</td>
                    <td className="py-2.5 pr-4 text-gray-600">{classroomName(s.classroomId)}</td>
                    <td className="py-2.5 pr-4 text-gray-600">{WEEKDAYS_JP[s.dayOfWeek]}曜日</td>
                    <td className="py-2.5 pr-4 text-gray-600">{s.timeBand}</td>
                    <td className="py-2.5">
                      {s.isOpeningDuty && (
                        <Badge variant="outline" className="border-amber-400 text-amber-700">
                          あり
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
