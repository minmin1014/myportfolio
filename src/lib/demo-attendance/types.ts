export type Classroom = {
  id: string;
  name: string;
};

export type Student = {
  id: string;
  name: string;
  grade: string;
  classroomId: string;
  dayOfWeek: number; // 0 = Sunday .. 6 = Saturday
  slotNumber: number; // 1-6, matches STANDARD_SLOTS
};

export type AttendanceEntry = {
  id: string;
  workDate: string; // yyyy-MM-dd
  classroomId: string;
  slotCount: number;
  timeBand: string;
  checkInAt: string; // ISO timestamp
  checkOutAt: string | null;
};

export type TodayShift = {
  id: string;
  classroomId: string;
  slotCount: number;
  timeBand: string;
};

export type PlannedShift = {
  id: string;
  workDate: string; // yyyy-MM-dd
  classroomId: string;
  slotCount: number;
  timeBand: string;
  isOpeningDuty: boolean;
};

export type StaffMember = {
  id: string;
  name: string;
  classroomId: string;
  dayOfWeek: number;
  timeBand: string;
  isOpeningDuty: boolean;
};

export type CommutePattern = {
  id: string;
  classroomId: string;
  transportName: string;
  fromStation: string;
  toStation: string;
  costOneWay: number;
  isDefault: boolean;
};

export type MonthlyReport = {
  id: string;
  yearMonth: string; // yyyy-MM
  slotCount: number;
  totalAmount: number;
  status: "確定済" | "作成可能";
};
