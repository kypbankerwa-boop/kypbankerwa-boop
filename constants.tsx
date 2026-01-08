
import React from 'react';
import { 
  Users, 
  MapPin, 
  CreditCard, 
  ClipboardCheck, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Printer
} from 'lucide-react';

export const LIBRARY_NAME = "GO LIB STUDY HUB";
export const LIBRARY_TAGLINE = "Your Path to Success Starts Here";
export const TOTAL_SEATS = 50;

export const NAV_ITEMS = [
  { label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" />, path: 'dashboard' },
  { label: 'Students', icon: <Users className="w-5 h-5" />, path: 'students' },
  { label: 'Seat Map', icon: <MapPin className="w-5 h-5" />, path: 'seat-map' },
  { label: 'Payments', icon: <CreditCard className="w-5 h-5" />, path: 'payments' },
  { label: 'Attendance', icon: <ClipboardCheck className="w-5 h-5" />, path: 'attendance' },
  { label: 'Reports', icon: <BarChart3 className="w-5 h-5" />, path: 'reports' },
  { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: 'settings' },
];

export const PLANS = [
  { label: 'Monthly', duration: 1 },
  { label: 'Quarterly', duration: 3 },
  { label: 'Half Yearly', duration: 6 },
  { label: 'Yearly', duration: 12 },
];
