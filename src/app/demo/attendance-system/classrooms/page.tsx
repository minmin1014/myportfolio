"use client";

import { useDemoAttendance } from "@/lib/demo-attendance/store";
import { DEMO_COMMUTE_PATTERNS } from "@/lib/demo-attendance/seed";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "../_components/ui";

export default function DemoClassroomsPage() {
  const { classrooms } = useDemoAttendance();

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">教室・通勤手段管理</h1>
      <p className="text-xs text-gray-400">
        表示されている教室名・通勤手段はすべてダミーデータです。このデモでは編集はできません。
      </p>

      <Card>
        <CardHeader>
          <CardTitle>登録済み教室</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {classrooms.map((classroom) => {
            const patterns = DEMO_COMMUTE_PATTERNS.filter((p) => p.classroomId === classroom.id);
            return (
              <div key={classroom.id} className="rounded-lg border p-4 space-y-3">
                <h3 className="text-lg font-semibold">{classroom.name}</h3>
                {patterns.length > 0 ? (
                  <div className="space-y-2">
                    {patterns.map((p) => (
                      <div
                        key={p.id}
                        className="flex flex-wrap items-center gap-2 rounded bg-gray-50 p-2 text-sm"
                      >
                        {p.isDefault && <Badge variant="outline">既定</Badge>}
                        <span>{p.transportName}</span>
                        <span className="text-gray-500">
                          {p.fromStation}〜{p.toStation}
                        </span>
                        <span className="text-gray-500">¥{p.costOneWay.toLocaleString()}</span>
                        <span className="text-gray-500">片道</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">通勤パターンなし</p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>定期券</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">定期券が登録されていません</p>
        </CardContent>
      </Card>
    </div>
  );
}
