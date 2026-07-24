"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoAttendance } from "@/lib/demo-attendance/store";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select } from "../_components/ui";

export default function DemoSettingsPage() {
  const { resetDemo, classrooms } = useDemoAttendance();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("山田 太郎");
  const [slotRate, setSlotRate] = useState("1860");
  const [homeStation, setHomeStation] = useState("東京");
  const [defaultClassroomId, setDefaultClassroomId] = useState(classrooms[0]?.id ?? "");
  const [saved, setSaved] = useState(false);

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function handleReset() {
    resetDemo();
    router.push("/demo/attendance-system");
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">設定</h1>
      <p className="text-xs text-gray-400">
        このデモでは保存内容は画面上だけの一時的なものです（実際には送信されません）。
      </p>

      <Card>
        <CardHeader>
          <CardTitle>プロファイル</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">氏名（給与申告書に表示）</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slotRate">80分コマ給（円）</Label>
              <Input
                id="slotRate"
                type="number"
                value={slotRate}
                onChange={(e) => setSlotRate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="homeStation">自宅最寄駅（交通費申請書に表示）</Label>
              <Input
                id="homeStation"
                value={homeStation}
                onChange={(e) => setHomeStation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultClassroom">デフォルト教室</Label>
              <Select
                id="defaultClassroom"
                value={defaultClassroomId}
                onChange={(e) => setDefaultClassroomId(e.target.value)}
              >
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
            <Button type="submit">{saved ? "保存しました" : "保存する"}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>パスワード変更</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-500">
          このデモでは省略しています。
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>デモのリセット</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-500">
            デモのダミーデータをリセットし、サインイン画面に戻ります。
          </p>
          <Button variant="outline" onClick={handleReset}>
            デモデータをリセットする
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
