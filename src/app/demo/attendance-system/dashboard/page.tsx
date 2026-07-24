"use client";

import Link from "next/link";
import { Play, ExternalLink } from "lucide-react";
import { useDemoAttendance } from "@/lib/demo-attendance/store";
import { formatFullDateJP, formatMonthDay, todayDateStr } from "@/lib/demo-attendance/format";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "../_components/ui";

export default function DemoDashboardPage() {
  const { entries, classrooms, todayShifts, todayEntry, clockIn, clockOut } = useDemoAttendance();

  const classroomName = (id: string) => classrooms.find((c) => c.id === id)?.name ?? "―";
  const today = todayDateStr();
  const recentEntries = entries.slice(0, 6);
  const thisMonthSlots = entries
    .filter((e) => e.workDate.slice(0, 7) === today.slice(0, 7))
    .reduce((sum, e) => sum + e.slotCount, 0);
  const plannedSlots = thisMonthSlots + todayShifts.reduce((sum, s) => sum + s.slotCount, 0);
  const ratePerSlot = 2000;
  const workedTotal = thisMonthSlots * ratePerSlot;
  const plannedTotal = plannedSlots * ratePerSlot;

  const recordedTodayClassroomIds = new Set(
    entries.filter((e) => e.workDate === today).map((e) => e.classroomId),
  );

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
        <p className="text-gray-500">{formatFullDateJP(new Date())}</p>
      </div>

      {/* 本日の勤務状況 */}
      <Card>
        <CardContent className="pt-6">
          {todayEntry ? (
            <div className="space-y-3 text-center">
              <Badge className="px-4 py-1.5 text-base">勤務中</Badge>
              <p className="text-gray-500">
                {classroomName(todayEntry.classroomId)} ・ {todayEntry.slotCount}コマ担当中
              </p>
              <Button variant="outline" onClick={() => clockOut(todayEntry.id)}>
                勤務を終了する
              </Button>
            </div>
          ) : todayShifts.length === 0 ? (
            <p className="text-center text-gray-500">今日のシフトはありません</p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-500">今日のシフト</p>
              {todayShifts.map((shift) => {
                const recorded = recordedTodayClassroomIds.has(shift.classroomId);
                return (
                  <div
                    key={shift.id}
                    className="flex items-center justify-between rounded-lg border bg-gray-50/60 p-3"
                  >
                    <div>
                      <div className="text-sm font-medium">{classroomName(shift.classroomId)}</div>
                      <div className="text-xs text-gray-500">{shift.timeBand}</div>
                      <Badge variant="outline" className="mt-1 text-[10px]">
                        {shift.slotCount}コマ
                      </Badge>
                    </div>
                    {recorded ? (
                      <Badge variant="outline" className="gap-1 border-green-300 text-green-700">
                        <ExternalLink size={12} />
                        出勤済
                      </Badge>
                    ) : (
                      <Button size="sm" onClick={() => clockIn(shift.id)}>
                        <Play size={12} />
                        出勤
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 月次集計 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-gray-500">今月のコマ数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {thisMonthSlots}
              <span className="text-lg font-normal text-gray-400"> / {plannedSlots}</span>
            </p>
            <p className="text-xs text-gray-500">コマ出勤済 / 予定</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-gray-500">現在の合計額</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">¥{workedTotal.toLocaleString()}</p>
            <p className="text-xs text-gray-500">デモ用の仮単価で計算</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-gray-500">合計見込</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">¥{plannedTotal.toLocaleString()}</p>
            <p className="text-xs text-gray-500">全シフト出勤時の見込み</p>
          </CardContent>
        </Card>
      </div>

      {/* 最近の勤怠 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>最近の勤怠</CardTitle>
            <Link
              href="/demo/attendance-system/attendance"
              className="text-sm text-gray-900 underline underline-offset-2"
            >
              すべて見る
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentEntries.length === 0 ? (
            <p className="text-sm text-gray-500">勤怠記録がありません</p>
          ) : (
            <div className="space-y-1">
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50"
                >
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
                  {!entry.checkOutAt && <Badge>勤務中</Badge>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
