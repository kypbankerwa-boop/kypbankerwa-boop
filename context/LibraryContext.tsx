
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Student, Payment, Seat, Attendance, User, UserRole, MembershipStatus, SeatLog, Shift } from '../types';
import { TOTAL_SEATS } from '../constants';

interface LibraryContextType {
  students: Student[];
  payments: Payment[];
  seats: Seat[];
  shifts: Shift[];
  attendance: Attendance[];
  seatLogs: SeatLog[];
  currentUser: User | null;
  addStudent: (student: Omit<Student, 'id' | 'studentId' | 'status'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  assignSeat: (studentId: string, seatNumber: string) => void;
  releaseSeat: (seatNumber: string) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'receiptNumber'>) => void;
  deletePayment: (paymentId: string) => void;
  markAttendance: (studentId: string, type: 'IN' | 'OUT') => { success: boolean; message: string };
  getStudentDue: (studentId: string) => number;
  login: (role: UserRole) => void;
  logout: () => void;
  updateSeatCount: (newCount: number) => { success: boolean; message: string };
  addShift: (shift: Omit<Shift, 'id'>) => void;
  updateShift: (id: string, updates: Partial<Shift>) => void;
  deleteShift: (id: string) => { success: boolean; message: string };
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

const DEFAULT_SHIFTS: Shift[] = [
  { id: '1', name: 'Morning (6AM - 12PM)', startTime: '06:00', endTime: '12:00', monthlyFee: 800, isActive: true },
  { id: '2', name: 'Day (12PM - 6PM)', startTime: '12:00', endTime: '18:00', monthlyFee: 800, isActive: true },
  { id: '3', name: 'Evening (6PM - 12AM)', startTime: '18:00', endTime: '00:00', monthlyFee: 800, isActive: true },
  { id: '4', name: 'Full Day (6AM - 12AM)', startTime: '06:00', endTime: '00:00', monthlyFee: 1500, isActive: true },
];

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [seatLogs, setSeatLogs] = useState<SeatLog[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>({ id: '1', name: 'Admin', role: UserRole.ADMIN, username: 'admin' });

  useEffect(() => {
    const stored = localStorage.getItem('golib_data_v3');
    let loadedStudents: Student[] = [];
    let loadedPayments: Payment[] = [];
    let loadedAttendance: Attendance[] = [];
    let loadedSeatLogs: SeatLog[] = [];
    let loadedSeats: Seat[] = [];
    let loadedShifts: Shift[] = [];

    if (stored) {
      const data = JSON.parse(stored);
      loadedStudents = data.students || [];
      loadedPayments = data.payments || [];
      loadedAttendance = data.attendance || [];
      loadedSeatLogs = data.seatLogs || [];
      loadedSeats = data.seats || [];
      loadedShifts = data.shifts || [];
    }

    if (loadedShifts.length === 0) loadedShifts = DEFAULT_SHIFTS;
    if (loadedSeats.length === 0) {
      loadedSeats = Array.from({ length: TOTAL_SEATS }, (_, i) => ({
        id: `${i + 1}`,
        number: `S-${i + 1}`,
        status: 'VACANT',
        studentId: null,
      }));
    }

    setStudents(loadedStudents);
    setPayments(loadedPayments);
    setAttendance(loadedAttendance);
    setSeatLogs(loadedSeatLogs);
    setSeats(loadedSeats);
    setShifts(loadedShifts);
  }, []);

  useEffect(() => {
    localStorage.setItem('golib_data_v3', JSON.stringify({ students, payments, attendance, seats, seatLogs, shifts }));
  }, [students, payments, attendance, seats, seatLogs, shifts]);

  const addShift = (data: Omit<Shift, 'id'>) => {
    const newShift = { ...data, id: Math.random().toString(36).substr(2, 9) };
    setShifts(prev => [...prev, newShift]);
  };

  const updateShift = (id: string, updates: Partial<Shift>) => {
    setShifts(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteShift = (id: string): { success: boolean; message: string } => {
    const shiftInUse = students.some(s => s.shiftId === id);
    if (shiftInUse) {
      return { 
        success: false, 
        message: 'Cannot delete shift. There are students currently enrolled in this shift. Please change their shift or remove them first.' 
      };
    }
    
    setShifts(prev => prev.filter(s => s.id !== id));
    return { success: true, message: 'Shift deleted successfully.' };
  };

  const addStudent = (data: Omit<Student, 'id' | 'studentId' | 'status'>) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const studentId = `GL-${new Date().getFullYear()}-${students.length + 101}`;
    const newStudent: Student = {
      ...data,
      id: newId,
      studentId,
      status: MembershipStatus.ACTIVE,
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setPayments(prev => prev.filter(p => p.studentId !== id));
    setAttendance(prev => prev.filter(a => a.studentId !== id));
  };

  const assignSeat = (studentId: string, seatNumber: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, seatNumber } : s));
  };

  const releaseSeat = (seatNumber: string) => {
    setStudents(prev => prev.map(s => s.seatNumber === seatNumber ? { ...s, seatNumber: null } : s));
  };

  const updateSeatCount = (newCount: number): { success: boolean; message: string } => {
    if (currentUser?.role !== UserRole.ADMIN) return { success: false, message: 'Admin only.' };
    const currentCount = seats.length;
    if (newCount > currentCount) {
      const newSeats: Seat[] = Array.from({ length: newCount - currentCount }, (_, i) => ({
        id: `${currentCount + i + 1}`,
        number: `S-${currentCount + i + 1}`,
        status: 'VACANT',
        studentId: null,
      }));
      setSeats(prev => [...prev, ...newSeats]);
      setSeatLogs(prev => [{ id: Math.random().toString(36).substr(2, 9), timestamp: new Date().toISOString(), prevCount: currentCount, newCount, adminName: currentUser.name }, ...prev]);
      return { success: true, message: `Increased to ${newCount}.` };
    } else if (newCount < currentCount) {
      const numbersToRemove = seats.slice(newCount).map(s => s.number);
      const inUse = students.filter(s => s.seatNumber && numbersToRemove.includes(s.seatNumber));
      if (inUse.length > 0) return { success: false, message: `Cannot remove. Seats are occupied in some shifts.` };
      setSeats(prev => prev.slice(0, newCount));
      setSeatLogs(prev => [{ id: Math.random().toString(36).substr(2, 9), timestamp: new Date().toISOString(), prevCount: currentCount, newCount, adminName: currentUser.name }, ...prev]);
      return { success: true, message: `Decreased to ${newCount}.` };
    }
    return { success: true, message: 'No change.' };
  };

  const getStudentDue = useCallback((studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return 0;
    const totalPaid = payments.filter(p => p.studentId === studentId).reduce((sum, p) => sum + p.amount, 0);
    return student.planFee - totalPaid;
  }, [students, payments]);

  const addPayment = (data: Omit<Payment, 'id' | 'receiptNumber'>) => {
    const newPayment: Payment = { ...data, id: Math.random().toString(36).substr(2, 9), receiptNumber: `RCP-${Date.now().toString().slice(-6)}` };
    setPayments(prev => [...prev, newPayment]);
  };

  const deletePayment = (paymentId: string) => setPayments(prev => prev.filter(p => p.id !== paymentId));

  const markAttendance = (studentId: string, type: 'IN' | 'OUT'): { success: boolean; message: string } => {
    const student = students.find(s => s.id === studentId);
    if (!student) return { success: false, message: 'Student not found.' };

    const shift = shifts.find(sh => sh.id === student.shiftId);
    if (!shift) return { success: false, message: 'Shift not found.' };

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startH, startM] = shift.startTime.split(':').map(Number);
    const [endH, endM] = shift.endTime.split(':').map(Number);
    const startTimeInMins = startH * 60 + startM;
    const endTimeInMins = (endH === 0 ? 24 : endH) * 60 + endM;

    if (currentTime < startTimeInMins - 30 || currentTime > endTimeInMins + 30) {
      return { success: false, message: `Attendance only allowed during shift: ${shift.name}` };
    }

    const today = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString();

    if (type === 'IN') {
      const alreadyIn = attendance.find(a => a.studentId === studentId && a.date === today && !a.outTime);
      if (alreadyIn) return { success: false, message: 'Already punched in.' };
      setAttendance(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), studentId, date: today, inTime: timeStr, outTime: null, shiftId: student.shiftId }]);
    } else {
      setAttendance(prev => prev.map(a => (a.studentId === studentId && a.date === today && !a.outTime) ? { ...a, outTime: timeStr } : a));
    }
    return { success: true, message: 'Attendance recorded.' };
  };

  const login = (role: UserRole) => setCurrentUser({ id: '1', name: role === UserRole.ADMIN ? 'Administrator' : 'Staff Member', role, username: role.toLowerCase() });
  const logout = () => setCurrentUser(null);

  return (
    <LibraryContext.Provider value={{
      students, payments, seats, attendance, seatLogs, shifts, currentUser,
      addStudent, updateStudent, deleteStudent,
      assignSeat, releaseSeat, addPayment, deletePayment,
      markAttendance, getStudentDue, login, logout, updateSeatCount,
      addShift, updateShift, deleteShift
    }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within a LibraryProvider');
  return context;
};
