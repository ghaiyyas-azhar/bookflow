import type { Booking, Category, Customer, DashboardMetric, Service, Staff } from "@/types";

export const dashboardMetrics: DashboardMetric[] = [
  { title: "Total Bookings", value: "1,284", change: "+12.5%", trend: "up", icon: "CalendarCheck" },
  { title: "Active Customers", value: "856", change: "+8.2%", trend: "up", icon: "Users" },
  { title: "Revenue This Month", value: "$24,560", change: "+15.3%", trend: "up", icon: "DollarSign" },
  { title: "Completion Rate", value: "94.2%", change: "-0.4%", trend: "down", icon: "TrendingUp" },
];

export const mockBookings: Booking[] = [
  {
    id: "1",
    code: "BK-1024",
    customerName: "Olivia Martin",
    serviceName: "Premium Spa Treatment",
    staffName: "Dr. Sarah Kim",
    date: "2024-10-20",
    startTime: "09:00",
    endTime: "10:30",
    status: "confirmed",
    amount: 120,
  },
  {
    id: "2",
    code: "BK-1025",
    customerName: "Jackson Lee",
    serviceName: "Massage Therapy",
    staffName: "Jake Thompson",
    date: "2024-10-20",
    startTime: "11:00",
    endTime: "12:00",
    status: "pending",
    amount: 85,
  },
  {
    id: "3",
    code: "BK-1026",
    customerName: "Isabella Nguyen",
    serviceName: "Hair Styling",
    staffName: "Anna Johnson",
    date: "2024-10-21",
    startTime: "14:00",
    endTime: "15:30",
    status: "completed",
    amount: 65,
  },
  {
    id: "4",
    code: "BK-1027",
    customerName: "William Chen",
    serviceName: "Fitness Consultation",
    staffName: "Dr. Sarah Kim",
    date: "2024-10-22",
    startTime: "09:30",
    endTime: "10:30",
    status: "confirmed",
    amount: 95,
  },
];

export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Olivia Martin",
    email: "olivia.martin@example.com",
    phone: "(+1) 555-0123",
    avatar: "",
    totalBookings: 24,
    totalSpent: 2840,
    lastVisit: "2024-10-18",
    joinedAt: "2023-05-12",
  },
  {
    id: "2",
    name: "Jackson Lee",
    email: "jackson.lee@example.com",
    phone: "(+1) 555-0145",
    avatar: "",
    totalBookings: 18,
    totalSpent: 1520,
    lastVisit: "2024-10-15",
    joinedAt: "2023-08-22",
  },
  {
    id: "3",
    name: "Isabella Nguyen",
    email: "isabella.nguyen@example.com",
    phone: "(+1) 555-0167",
    avatar: "",
    totalBookings: 32,
    totalSpent: 3520,
    lastVisit: "2024-10-19",
    joinedAt: "2022-12-05",
  },
];

export const mockServices: Service[] = [
  {
    id: "1",
    name: "Premium Spa Treatment",
    description: "Luxurious full body spa treatment with essential oils",
    duration: 90,
    price: 120,
    category: "Wellness",
    isActive: true,
  },
  {
    id: "2",
    name: "Massage Therapy",
    description: "Deep tissue massage for stress relief",
    duration: 60,
    price: 85,
    category: "Wellness",
    isActive: true,
  },
  {
    id: "3",
    name: "Hair Styling",
    description: "Professional hair cutting and styling",
    duration: 45,
    price: 65,
    category: "Beauty",
    isActive: true,
  },
];

export const mockStaff: Staff[] = [
  {
    id: "1",
    name: "Dr. Sarah Kim",
    email: "sarah.kim@bookflow.com",
    role: "admin",
    avatar: "",
    status: "active",
    totalServices: 42,
    rating: 4.9,
  },
  {
    id: "2",
    name: "Jake Thompson",
    email: "jake.thompson@bookflow.com",
    role: "staff",
    avatar: "",
    status: "active",
    totalServices: 35,
    rating: 4.8,
  },
  {
    id: "3",
    name: "Anna Johnson",
    email: "anna.johnson@bookflow.com",
    role: "manager",
    avatar: "",
    status: "on-leave",
    totalServices: 28,
    rating: 4.7,
  },
];

export const mockCategories: Category[] = [
  { id: "1", name: "Wellness", description: "Spa, massage and relaxation services", totalServices: 12 },
  { id: "2", name: "Beauty", description: "Hair, nail and skincare services", totalServices: 18 },
  { id: "3", name: "Fitness", description: "Personal training and yoga sessions", totalServices: 8 },
];

export const sidebarNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/bookings", label: "Bookings", icon: "CalendarCheck" },
  { href: "/calendar", label: "Calendar", icon: "Calendar" },
  { href: "/services", label: "Services", icon: "Scissors" },
  { href: "/categories", label: "Categories", icon: "Layers" },
  { href: "/staff", label: "Staff", icon: "Users" },
  { href: "/customers", label: "Customers", icon: "User" },
  { href: "/reports", label: "Reports", icon: "BarChart3" },
  { href: "/settings", label: "Settings", icon: "Settings" },
];
