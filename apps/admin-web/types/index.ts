export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type StaffStatus = "active" | "inactive" | "on-leave";
export type UserRole = "admin" | "manager" | "staff";

export interface Booking {
  id: string;
  code: string;
  customerName: string;
  serviceName: string;
  staffName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  amount: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit: string;
  joinedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  totalServices: number;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: StaffStatus;
  totalServices: number;
  rating: number;
}

export interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: string;
}

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}
