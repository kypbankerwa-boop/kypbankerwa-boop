
export enum MembershipStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  monthlyFee: number;
  isActive: boolean;
}

export interface Student {
  id: string;
  studentId: string;
  fullName: string;
  fatherName: string;
  mobile: string;
  address: string;
  seatNumber: string | null;
  shiftId: string;
  idProofType: string;
  idProofNumber: string;
  photoUrl: string;
  joiningDate: string;
  planFee: number;
  planDurationMonths: number;
  expiryDate: string;
  status: MembershipStatus;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  mode: 'CASH' | 'ONLINE' | 'UPI';
  receiptNumber: string;
}

export interface Seat {
  id: string;
  number: string;
  status: 'VACANT' | 'OCCUPIED' | 'LOCKED';
  studentId: string | null;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  inTime: string;
  outTime: string | null;
  shiftId: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  username: string;
}

export interface SeatLog {
  id: string;
  timestamp: string;
  prevCount: number;
  newCount: number;
  adminName: string;
}

export interface AppState {
  students: Student[];
  payments: Payment[];
  seats: Seat[];
  shifts: Shift[];
  attendance: Attendance[];
  currentUser: User | null;
  seatLogs: SeatLog[];
}
