"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { seedMonthlyReports } from "@/lib/demo-attendance/seed";
import { Badge, Button, Card, CardContent } from "../_components/ui";

export default function DemoReportsPage() {
  const reports = seedMonthlyReports();
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  function handleGenerate(id: string) {
    setGeneratingId(id);
    setTimeout(() => setGeneratingId(null), 900);
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">レポート</h1>
      <p className="text-xs text-gray-400">
        実際のシステムでは給与申告書・交通費申請書をPDF/Excelで生成できます。このデモでは生成ボタンの動作のみを再現しています。
      </p>

      <div className="space-y-2">
        {reports.map((r) => {
          const [y, m] = r.yearMonth.split("-");
          return (
            <Card key={r.id}>
              <CardContent className="flex items-center justify-between pt-4">
                <div>
                  <p className="font-medium">
                    {y}年{Number(m)}月分
                  </p>
                  <p className="text-sm text-gray-500">
                    {r.slotCount}コマ ・ ¥{r.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{r.status}</Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGenerate(r.id)}
                    disabled={generatingId === r.id}
                  >
                    <FileText size={14} />
                    {generatingId === r.id ? "生成中..." : "給与申告書を生成"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
