"use client"

import { useState } from "react"
import { 
  Plus, Search, Filter, Eye, Edit, Trash2, 
  Calendar, Clock, User, Scissors, Download, ChevronRight,
  ArrowUpDown, History, CheckCircle2, XCircle, AlertCircle
} from "lucide-react"
import { mockBookings } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"

export default function BookingsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = mockBookings.filter(b => {
    const matchesSearch = b.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          b.code.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = [
    { label: "Total Bookings", value: mockBookings.length, icon: History, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Confirmed", value: mockBookings.filter(b => b.status === "confirmed").length, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pending", value: mockBookings.filter(b => b.status === "pending").length, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Cancelled", value: mockBookings.filter(b => b.status === "cancelled").length, icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  ]

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Live Activity</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Booking Management</h1>
          <p className="text-sm text-muted-foreground">Manage service schedules, staff assignments, and booking lifecycle.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-10 border-white/10 hover:bg-white/5">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
          <Button className="h-10 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            Create Booking
          </Button>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-card/60 backdrop-blur-2xl p-4 rounded-xl border border-white/20 dark:border-white/10 flex items-center gap-4">
            <div className={`h-10 w-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">{stat.label}</div>
              <div className="text-xl font-bold text-foreground">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="glass-table-container rounded-3xl shadow-2xl overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-white/20 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/30 dark:bg-zinc-900/40">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              placeholder="Search by code or customer..." 
              className="flex h-10 w-full rounded-lg bg-background/50 border border-white/10 pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <select 
              className="h-10 px-3 rounded-lg bg-background/50 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button variant="outline" size="icon" className="h-10 w-10 border-white/10 hover:bg-white/5">
              <Filter className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 border-white/10 hover:bg-white/5">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/20 dark:border-white/10 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] bg-white/20 dark:bg-zinc-900/20">
                <th className="py-5 px-6">Code / ID</th>
                <th className="py-5 px-6">Customer Name</th>
                <th className="py-5 px-6">Service Details</th>
                <th className="py-5 px-6">Schedule & Duration</th>
                <th className="py-5 px-6">Status</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
                        <Search className="h-6 w-6 text-muted-foreground/50" />
                      </div>
                      <p>No bookings found matching your search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((booking) => (
                  <tr key={booking.id} className="hover:bg-white/5 transition-all group">
                    <td className="py-5 px-6">
                      <div className="font-bold text-foreground tracking-tight">{booking.code}</div>
                      <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1.5 uppercase font-medium">
                        <span className="h-1 w-1 rounded-full bg-white/20" /> ref_{booking.id.padStart(4, "0")}
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                          {booking.customerName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground leading-tight">{booking.customerName}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5 font-medium tracking-tight">Active Client</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-foreground font-semibold">
                          <div className="h-5 w-5 rounded bg-zinc-800 flex items-center justify-center">
                            <Scissors className="h-3 w-3 text-primary" />
                          </div>
                          {booking.serviceName}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                          <User className="h-3.5 w-3.5" /> Staff: {booking.staffName}
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-foreground font-medium">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> {booking.date}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-primary">
                          <Clock className="h-3.5 w-3.5" /> {booking.startTime} - {booking.endTime}
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                        booking.status === "confirmed" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                        booking.status === "pending" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                        booking.status === "completed" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                        "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/10">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/10">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500/80 hover:text-rose-500 hover:bg-rose-500/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="group-hover:hidden flex justify-end">
                        <div className="h-8 w-8 flex items-center justify-center text-muted-foreground/30">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/20 dark:border-white/10 flex items-center justify-between bg-white/30 dark:bg-zinc-900/40">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            Displaying <span className="text-foreground">{filtered.length}</span> / {mockBookings.length} records
          </p>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="h-8 border-white/10 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30" disabled>Prev</Button>
            <div className="flex items-center px-3 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[11px] font-black">1</div>
            <Button variant="outline" size="sm" className="h-8 border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5">Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
