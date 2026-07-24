"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useDemoAttendance } from "@/lib/demo-attendance/store";
import { todayDateStr } from "@/lib/demo-attendance/format";
import { STANDARD_SLOTS } from "@/lib/demo-attendance/seed";
import { Button, Card, CardContent, Input, Label, Select } from "../../_components/ui";

export default function DemoAttendanceNewPage() {
  const router = useRouter();
  const { classrooms, addManualEntry } = useDemoAttendance();
  const [workDate, setWorkDate] = useState(todayDateStr());
  const [classroomId, setClassroomId] = useState(classrooms[0]?.id ?? "");
  const [startSlot, setStartSlot] = useState(1);
  const [slotCount, setSlotCount] = useState(1);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addManualEntry({ workDate, classroomId, startSlot, slotCount });
    router.push("/demo/attendance-system/attendance");
  }

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/demo/attendance-system/attendance")}
      >
        <ArrowLeft size={16} />
        勤怠一覧へ戻る
      </Button>

      <h1 className="text-2xl font-bold">手動コマシフト追加</h1>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workDate">勤務日</Label>
              <Input
                id="workDate"
                type="date"
                value={workDate}
                onChange={(e) => setWorkDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="classroom">教室</Label>
              <Select
                id="classroom"
                value={classroomId}
                onChange={(e) => setClassroomId(e.target.value)}
              >
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startSlot">開始コマ</Label>
                <Select
                  id="startSlot"
                  value={startSlot}
                  onChange={(e) => setStartSlot(Number(e.target.value))}
                >
                  {STANDARD_SLOTS.map((slot, i) => (
                    <option key={slot.start} value={i + 1}>
                      第{i + 1}コマ（{slot.start}〜{slot.end}）
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="slotCount">コマ数</Label>
                <Select
                  id="slotCount"
                  value={slotCount}
                  onChange={(e) => setSlotCount(Number(e.target.value))}
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n}コマ
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full">
              追加する
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
