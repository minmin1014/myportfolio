import type {
  AttendanceEntry,
  Classroom,
  CommutePattern,
  MonthlyReport,
  PlannedShift,
  StaffMember,
  Student,
  TodayShift,
} from "./types";

// Generic class-period schedule, same shape as the real system — not sensitive.
export const STANDARD_SLOTS = [
  { start: "14:00", end: "15:20" },
  { start: "15:30", end: "16:50" },
  { start: "16:50", end: "18:10" },
  { start: "17:10", end: "18:30" },
  { start: "18:40", end: "20:00" },
  { start: "20:10", end: "21:30" },
] as const;

export function timeBandForSlots(startSlot: number, slotCount: number): string {
  const start = STANDARD_SLOTS[startSlot - 1];
  const end = STANDARD_SLOTS[Math.min(startSlot + slotCount - 2, STANDARD_SLOTS.length - 1)];
  if (!start || !end) return "";
  return `${start.start}〜${end.end}`;
}

export const DEMO_CLASSROOMS: Classroom[] = [
  { id: "c1", name: "A教室" },
  { id: "c2", name: "B教室" },
];

// Placeholder names in the same spirit as "山田太郎"-style example names — fictional, not
// drawn from any real roster.
export const DEMO_STUDENTS: Student[] = [
  { id: "s1", name: "山田 太郎", grade: "中2", classroomId: "c1", dayOfWeek: new Date().getDay(), slotNumber: 1 },
  { id: "s2", name: "佐藤 花子", grade: "小5", classroomId: "c1", dayOfWeek: new Date().getDay(), slotNumber: 1 },
  { id: "s3", name: "鈴木 一郎", grade: "高1", classroomId: "c1", dayOfWeek: new Date().getDay(), slotNumber: 2 },
  { id: "s4", name: "田中 美咲", grade: "中3", classroomId: "c2", dayOfWeek: new Date().getDay(), slotNumber: 2 },
  { id: "s5", name: "高橋 健太", grade: "小6", classroomId: "c2", dayOfWeek: new Date().getDay(), slotNumber: 1 },
  { id: "s6", name: "伊藤 さくら", grade: "中1", classroomId: "c1", dayOfWeek: new Date().getDay(), slotNumber: 3 },
];

function isoDaysAgo(days: number, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function dateStrDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function seedAttendanceEntries(): AttendanceEntry[] {
  return [
    {
      id: "e1",
      workDate: dateStrDaysAgo(1),
      classroomId: "c1",
      slotCount: 2,
      timeBand: timeBandForSlots(1, 2),
      checkInAt: isoDaysAgo(1, 13, 55),
      checkOutAt: isoDaysAgo(1, 16, 50),
    },
    {
      id: "e2",
      workDate: dateStrDaysAgo(3),
      classroomId: "c2",
      slotCount: 3,
      timeBand: timeBandForSlots(2, 3),
      checkInAt: isoDaysAgo(3, 15, 25),
      checkOutAt: isoDaysAgo(3, 18, 30),
    },
    {
      id: "e3",
      workDate: dateStrDaysAgo(5),
      classroomId: "c1",
      slotCount: 1,
      timeBand: timeBandForSlots(5, 1),
      checkInAt: isoDaysAgo(5, 18, 35),
      checkOutAt: isoDaysAgo(5, 20, 0),
    },
    {
      id: "e4",
      workDate: dateStrDaysAgo(8),
      classroomId: "c2",
      slotCount: 2,
      timeBand: timeBandForSlots(1, 2),
      checkInAt: isoDaysAgo(8, 13, 58),
      checkOutAt: isoDaysAgo(8, 16, 50),
    },
  ];
}

export function seedTodayShifts(): TodayShift[] {
  return [
    { id: "t1", classroomId: "c1", slotCount: 2, timeBand: timeBandForSlots(1, 2) },
  ];
}

function isoDaysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function seedPlannedShifts(): PlannedShift[] {
  return [
    { id: "p1", workDate: isoDaysFromNow(1), classroomId: "c1", slotCount: 2, timeBand: timeBandForSlots(1, 2), isOpeningDuty: true },
    { id: "p2", workDate: isoDaysFromNow(2), classroomId: "c2", slotCount: 3, timeBand: timeBandForSlots(2, 3), isOpeningDuty: false },
    { id: "p3", workDate: isoDaysFromNow(4), classroomId: "c1", slotCount: 1, timeBand: timeBandForSlots(5, 1), isOpeningDuty: false },
    { id: "p4", workDate: isoDaysFromNow(7), classroomId: "c2", slotCount: 2, timeBand: timeBandForSlots(1, 2), isOpeningDuty: true },
    { id: "p5", workDate: isoDaysFromNow(9), classroomId: "c1", slotCount: 2, timeBand: timeBandForSlots(3, 2), isOpeningDuty: false },
  ];
}

// Fictional colleague names in the same "placeholder name" spirit as the students list.
export const DEMO_STAFF: StaffMember[] = [
  { id: "st1", name: "渡辺 直樹", classroomId: "c1", dayOfWeek: 1, timeBand: timeBandForSlots(1, 2), isOpeningDuty: true },
  { id: "st2", name: "中村 陽子", classroomId: "c1", dayOfWeek: 2, timeBand: timeBandForSlots(2, 2), isOpeningDuty: false },
  { id: "st3", name: "小林 大輔", classroomId: "c2", dayOfWeek: 1, timeBand: timeBandForSlots(1, 3), isOpeningDuty: true },
  { id: "st4", name: "加藤 麻衣", classroomId: "c2", dayOfWeek: 3, timeBand: timeBandForSlots(2, 2), isOpeningDuty: false },
];

export const DEMO_COMMUTE_PATTERNS: CommutePattern[] = [
  { id: "cp1", classroomId: "c1", transportName: "電車", fromStation: "梅田", toStation: "A教室最寄駅", costOneWay: 280, isDefault: true },
  { id: "cp2", classroomId: "c2", transportName: "電車", fromStation: "梅田", toStation: "B教室最寄駅", costOneWay: 350, isDefault: true },
];

export function seedMonthlyReports(): MonthlyReport[] {
  const now = new Date();
  return [0, 1, 2].map((i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return {
      id: `r-${ym}`,
      yearMonth: ym,
      slotCount: 24 - i * 3,
      totalAmount: (24 - i * 3) * 2000,
      status: i === 0 ? "作成可能" : "確定済",
    };
  });
}
