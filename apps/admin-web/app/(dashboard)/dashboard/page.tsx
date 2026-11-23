"use client"

import { useState } from "react"
import { 
  DollarSign, Users, CalendarCheck, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Calendar, Download, ChevronRight, Clock, CheckCircle2, Plus, Sparkles
} from "lucide-react"
import { dashboardMetrics, mockBookings } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("this-month")
  const [filterStatus, setFilterStatus] = useState("all")
  const [chartMetric, setChartMetric] = useState<"revenue" | "bookings">("revenue")

  const filteredBookings = mockBookings.filter(b => {
    if (filterStatus === "all") return true
    return b.status === filterStatus
  })

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto w-full">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              <Sparkles className="mr-1 h-3 w-3" /> Production SaaS
            </span>
            <span className="text-xs text-muted-foreground">• Last updated: Just now</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground">Real-time performance metrics, financial analytics, and booking activity.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 p-1 text-xs font-medium">
            <button
              onClick={() => setDateRange("today")}
              className={`px-3 py-1.5 rounded-md transition-all ${dateRange === "today" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              Today
            </button>
            <button
              onClick={() => setDateRange("this-week")}
              className={`px-3 py-1.5 rounded-md transition-all ${dateRange === "this-week" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              This Week
            </button>
            <button
              onClick={() => setDateRange("this-month")}
              className={`px-3 py-1.5 rounded-md transition-all ${dateRange === "this-month" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              This Month
            </button>
          </div>

          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardMetrics.map((metric, idx) => {
          const isUp = metric.trend === "up"
          return (
            <div key={idx} className="glass-card rounded-3xl p-6 flex flex-col justify-between hover:border-primary/50 transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  {idx === 0 && <CalendarCheck className="h-5 w-5" />}
                  {idx === 1 && <Users className="h-5 w-5" />}
                  {idx === 2 && <DollarSign className="h-5 w-5" />}
                  {idx === 3 && <TrendingUp className="h-5 w-5" />}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold tracking-tight text-foreground">{metric.value}</div>
                <div className="mt-2 flex items-center gap-1.5 text-xs">
                  <span className={`inline-flex items-center font-semibold px-1.5 py-0.5 rounded ${isUp ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
                    {isUp ? <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> : <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />}
                    {metric.change}
                  </span>
                  <span className="text-muted-foreground">vs previous period</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue / Booking Chart */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Analytics Overview</h2>
              <p className="text-sm text-muted-foreground">Detailed breakdown of financial and booking metrics.</p>
            </div>
            <div className="inline-flex rounded-lg bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 p-1 text-xs">
              <button 
                onClick={() => setChartMetric("revenue")}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${chartMetric === "revenue" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
              >
                Revenue
              </button>
              <button 
                onClick={() => setChartMetric("bookings")}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${chartMetric === "bookings" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
              >
                Bookings
              </button>
            </div>
          </div>

          {/* Interactive Simulated Bar Chart */}
          <div className="h-64 w-full flex items-end justify-between gap-2 pt-6 px-2 border-b">
            {[
              { label: "Mon", rev: 3200, book: 42 },
              { label: "Tue", rev: 4100, book: 58 },
              { label: "Wed", rev: 3800, book: 51 },
              { label: "Thu", rev: 5200, book: 69 },
              { label: "Fri", rev: 6400, book: 85 },
              { label: "Sat", rev: 7800, book: 104 },
              { label: "Sun", rev: 5900, book: 77 },
            ].map((item, idx) => {
              const val = chartMetric === "revenue" ? item.rev : item.book * 80
              const heightPct = Math.min(100, Math.max(20, (val / 8000) * 100))
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group/bar">
                  <div className="text-[10px] font-semibold text-muted-foreground opacity-0 group-hover/bar:opacity-100 transition-opacity">
                    {chartMetric === "revenue" ? `$${item.rev}` : item.book}
                  </div>
                    <div 
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[48px] bg-foreground/10 hover:bg-primary/50 rounded-t-lg transition-all duration-300 relative group-hover/bar:bg-foreground/20"
                    >
                      <div className="absolute inset-x-0 top-0 bg-primary h-1 rounded-t-lg" />
                    </div>
                  <span className="text-xs font-medium text-muted-foreground mt-2">{item.label}</span>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <span>Showing daily totals for {dateRange.replace("-", " ")}</span>
            <span className="font-semibold text-foreground">Peak: Saturday ($7,800 / 104 bookings)</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
            <p className="text-sm text-muted-foreground mb-6">Frequently used administrative shortcuts.</p>
            
            <div className="space-y-3">
              <Link href="/bookings" className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">New Booking</div>
                    <div className="text-xs text-muted-foreground">Create manual appointment</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link href="/services" className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Add Service</div>
                    <div className="text-xs text-muted-foreground">Configure new offering</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link href="/staff" className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Manage Staff</div>
                    <div className="text-xs text-muted-foreground">Update team schedules</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Workspace: Main Branch</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> Systems Optimal
            </span>
          </div>
        </div>
      </div>

      {/* Recent Bookings & Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings Table (2 cols) */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Recent Bookings</h2>
              <p className="text-sm text-muted-foreground">Latest transactions and appointment requests.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 p-1 text-xs">
                <button 
                  onClick={() => setFilterStatus("all")}
                  className={`px-2.5 py-1 rounded-md font-medium ${filterStatus === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilterStatus("confirmed")}
                  className={`px-2.5 py-1 rounded-md font-medium ${filterStatus === "confirmed" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  Confirmed
                </button>
                <button 
                  onClick={() => setFilterStatus("pending")}
                  className={`px-2.5 py-1 rounded-md font-medium ${filterStatus === "pending" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  Pending
                </button>
              </div>
              <Link href="/bookings" className="inline-flex h-7 gap-1 px-2.5 rounded-[min(var(--radius-md),12px)] text-sm font-medium hover:bg-muted hover:text-foreground items-center">
                View All
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No bookings found matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground">{booking.code}</td>
                      <td className="py-3 px-4 font-medium text-foreground">{booking.customerName}</td>
                      <td className="py-3 px-4 text-muted-foreground">{booking.serviceName}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        <div>{booking.date}</div>
                        <div className="font-semibold text-foreground">{booking.startTime} - {booking.endTime}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          booking.status === "confirmed" ? "bg-emerald-500/10 text-emerald-600" :
                          booking.status === "pending" ? "bg-amber-500/10 text-amber-600" :
                          booking.status === "completed" ? "bg-blue-500/10 text-blue-600" :
                          "bg-rose-500/10 text-rose-600"
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-foreground">${booking.amount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Upcoming Today</h2>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Clock className="mr-1 h-3 w-3" /> Next 4 Hours
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Scheduled staff assignments for today.</p>

            <div className="space-y-4">
              {[
                { time: "09:00 AM", client: "Olivia Martin", service: "Premium Spa Treatment", staff: "Dr. Sarah Kim" },
                { time: "11:00 AM", client: "Jackson Lee", service: "Massage Therapy", staff: "Jake Thompson" },
                { time: "02:00 PM", client: "Isabella Nguyen", service: "Hair Styling", staff: "Anna Johnson" },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border bg-muted/20 flex flex-col gap-2 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">{item.time}</span>
                    <span className="text-xs text-muted-foreground">Staff: {item.staff}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{item.client}</div>
                    <div className="text-xs text-muted-foreground">{item.service}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
              <Link href="/calendar" className="inline-flex w-full h-8 gap-1.5 px-2.5 rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium justify-center items-center">
                Open Full Calendar
              </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
