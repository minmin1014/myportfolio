"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AttendanceEntry } from "./types";
import {
  DEMO_CLASSROOMS,
  DEMO_STUDENTS,
  seedAttendanceEntries,
  seedTodayShifts,
  timeBandForSlots,
} from "./seed";

const STORAGE_KEY = "demo-attendance-state-v1";

type PersistedState = {
  isSignedIn: boolean;
  entries: AttendanceEntry[];
};

function loadPersisted(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

function defaultState(): PersistedState {
  return { isSignedIn: false, entries: seedAttendanceEntries() };
}

type DemoAttendanceContextValue = {
  ready: boolean;
  isSignedIn: boolean;
  entries: AttendanceEntry[];
  classrooms: typeof DEMO_CLASSROOMS;
  students: typeof DEMO_STUDENTS;
  todayShifts: ReturnType<typeof seedTodayShifts>;
  todayEntry: AttendanceEntry | undefined;
  signIn: () => void;
  signOut: () => void;
  clockIn: (shiftId: string) => void;
  clockOut: (entryId: string) => void;
  addManualEntry: (input: {
    workDate: string;
    classroomId: string;
    startSlot: number;
    slotCount: number;
  }) => void;
  resetDemo: () => void;
};

const DemoAttendanceContext = createContext<DemoAttendanceContextValue | null>(null);

const todayStr = () => new Date().toISOString().slice(0, 10);

export function DemoAttendanceProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [entries, setEntries] = useState<AttendanceEntry[]>(() => seedAttendanceEntries());
  const todayShifts = useMemo(() => seedTodayShifts(), []);

  // One-time hydration from localStorage (a browser-only external store), so the
  // server-rendered default never mismatches the client's first paint.
  useEffect(() => {
    const persisted = loadPersisted();
    if (persisted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSignedIn(persisted.isSignedIn);
      setEntries(persisted.entries);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || typeof window === "undefined") return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ isSignedIn, entries } satisfies PersistedState),
    );
  }, [ready, isSignedIn, entries]);

  const signIn = useCallback(() => setIsSignedIn(true), []);
  const signOut = useCallback(() => setIsSignedIn(false), []);

  const clockIn = useCallback(
    (shiftId: string) => {
      const shift = todayShifts.find((s) => s.id === shiftId);
      if (!shift) return;
      const entry: AttendanceEntry = {
        id: `e-${Date.now()}`,
        workDate: todayStr(),
        classroomId: shift.classroomId,
        slotCount: shift.slotCount,
        timeBand: shift.timeBand,
        checkInAt: new Date().toISOString(),
        checkOutAt: null,
      };
      setEntries((prev) => [entry, ...prev]);
    },
    [todayShifts],
  );

  const clockOut = useCallback((entryId: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, checkOutAt: new Date().toISOString() } : e)),
    );
  }, []);

  const addManualEntry = useCallback(
    (input: { workDate: string; classroomId: string; startSlot: number; slotCount: number }) => {
      const entry: AttendanceEntry = {
        id: `e-${Date.now()}`,
        workDate: input.workDate,
        classroomId: input.classroomId,
        slotCount: input.slotCount,
        timeBand: timeBandForSlots(input.startSlot, input.slotCount),
        checkInAt: new Date(`${input.workDate}T12:00:00`).toISOString(),
        checkOutAt: new Date(`${input.workDate}T12:00:00`).toISOString(),
      };
      setEntries((prev) => [entry, ...prev]);
    },
    [],
  );

  const resetDemo = useCallback(() => {
    const fresh = defaultState();
    setIsSignedIn(fresh.isSignedIn);
    setEntries(fresh.entries);
  }, []);

  const todayEntry = entries.find((e) => e.workDate === todayStr() && !e.checkOutAt);

  const value: DemoAttendanceContextValue = {
    ready,
    isSignedIn,
    entries,
    classrooms: DEMO_CLASSROOMS,
    students: DEMO_STUDENTS,
    todayShifts,
    todayEntry,
    signIn,
    signOut,
    clockIn,
    clockOut,
    addManualEntry,
    resetDemo,
  };

  return (
    <DemoAttendanceContext.Provider value={value}>
      {children}
    </DemoAttendanceContext.Provider>
  );
}

export function useDemoAttendance() {
  const ctx = useContext(DemoAttendanceContext);
  if (!ctx) throw new Error("useDemoAttendance must be used within DemoAttendanceProvider");
  return ctx;
}
