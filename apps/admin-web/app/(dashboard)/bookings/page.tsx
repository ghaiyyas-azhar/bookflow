"use client"

import { useState } from "react"
import { 
  Plus, Search, Eye, Edit, Trash2,
  Calendar, Clock, User, Scissors, Download, 
  ArrowUpDown, History, CheckCircle2, XCircle, AlertCircle, X, Check
} from "lucide-react"
import { mockBookings, mockCustomers, mockServices, mockStaff } from "@/lib/mock-data"
import type { Booking } from "@/types"
import { Button } from "@/components/ui/button"

const statusStyles: Record<string, string> = {
  confirmed: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
  completed: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
  cancelled: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
}

const nextStatus: Partial<Record<Booking["status"], Booking["status"]>> = {
  pending: "confirmed",
  confirmed: "completed",
}

type FormState = {
  customerName: string
  serviceName: string
  staffName: string
  date: string
  startTime: string
  endTime: string
  amount: string
}

const emptyForm: FormState = {
  customerName: "",
  serviceName: mockServices[0].name,
  staffName: mockStaff[0].name,
  date: "",
  startTime: "",
  endTime: "",
  amount: "",
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortAsc, setSortAsc] = useState(true)
  const [page, setPage] = useState(1)
  const perPage = 5

  const [detail, setDetail] = useState<Booking | null>(null)
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [formError, setFormError] = useState("")

  const filtered = bookings
    .filter(b => {
      const matchesSearch = b.customerName.toLowerCase().includes(search.toLowerCase()) ||
                            b.code.toLowerCase().includes(search.toLowerCase())
      return matchesSearch && (statusFilter === "all" || b.status === statusFilter)
    })
    .sort((a, b) => sortAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date))

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: History, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pending", value: bookings.filter(b => b.status === "pending").length, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Cancelled", value: bookings.filter(b => b.status === "cancelled").length, icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  ]

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setFormError(""); setFormMode("create") }
  const openEdit = (b: Booking) => {
    setForm({ customerName: b.customerName, serviceName: b.serviceName, staffName: b.staffName, date: b.date, startTime: b.startTime, endTime: b.endTime, amount: String(b.amount) })
    setEditingId(b.id); setFormError(""); setFormMode("edit")
  }

  const saveBooking = () => {
    if (!form.customerName.trim() || !form.date || !form.startTime || !form.endTime) {
      setFormError("Customer, date, start time and end time are required.")
      return
    }
    if (form.endTime <= form.startTime) {
      setFormError("End time must be after start time.")
      return
    }
    const conflict = bookings.some(b =>
      b.id !== editingId && b.status !== "cancelled" && b.staffName === form.staffName &&
      b.date === form.date && b.startTime < form.endTime && b.endTime > form.startTime
    )
    if (conflict) {
      setFormError("Staff already has an overlapping booking at this time.")
      return
    }
    if (formMode === "create") {
      const nextId = String(Math.max(...bookings.map(b => Number(b.id)), 0) + 1)
      const created: Booking = {
        id: nextId,
        code: `BK-${1024 + Number(nextId)}`,
        customerName: form.customerName.trim(),
        serviceName: form.serviceName,
        staffName: form.staffName,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        status: "pending",
        amount: Number(form.amount) || 0,
      }
      setBookings(prev => [created, ...prev])
    } else {
      setBookings(prev => prev.map(b => b.id === editingId ? {
        ...b,
        customerName: form.customerName.trim(),
        serviceName: form.serviceName,
        staffName: form.staffName,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        amount: Number(form.amount) || b.amount,
      } : b))
    }
    setFormMode(null)
  }

  const setStatus = (id: string, status: Booking["status"]) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    setDetail(prev => prev?.id === id ? { ...prev, status } : prev)
  }

  const inputClass = "h-10 w-full rounded-xl glass-pill px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto w-full">
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
          <Button className="h-10 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Create Booking
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-card/60 backdrop-blur-2xl p-4 rounded-2xl border border-white/20 dark:border-white/10 flex items-center gap-4">
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

      <div className="glass-table-container rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-white/20 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/30 dark:bg-zinc-900/40">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search by code or customer..."
              className="flex h-10 w-full rounded-lg bg-background/50 border border-white/10 pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              className="h-10 px-3 rounded-lg glass-pill text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 text-foreground"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button variant="outline" size="icon" className="h-10 w-10 border-white/10 hover:bg-white/5" onClick={() => setSortAsc(!sortAsc)} title="Sort by date">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

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
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No bookings found matching your search criteria.
                  </td>
                </tr>
              ) : (
                paged.map((booking) => (
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
                        <div className="font-semibold text-foreground leading-tight">{booking.customerName}</div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-foreground font-semibold">
                          <Scissors className="h-3.5 w-3.5 text-primary" /> {booking.serviceName}
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${statusStyles[booking.status]}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/10" onClick={() => setDetail(booking)} title="View detail">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/10" onClick={() => openEdit(booking)} title="Edit booking">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500/80 hover:text-rose-500 hover:bg-rose-500/10" onClick={() => setStatus(booking.id, "cancelled")} disabled={booking.status === "cancelled"} title="Cancel booking">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-white/20 dark:border-white/10 flex items-center justify-between bg-white/30 dark:bg-zinc-900/40">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="h-8 border-white/10 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30" disabled={currentPage === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
            <div className="flex items-center px-3 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[11px] font-black">{currentPage}</div>
            <Button variant="outline" size="sm" className="h-8 border-white/10 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30" disabled={currentPage === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </div>

      {/* Booking detail dialog */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm" onClick={() => setDetail(null)}>
          <div className="glass-card rounded-3xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Booking Detail</p>
                <h2 className="text-xl font-bold text-foreground">{detail.code}</h2>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetail(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span className="font-semibold text-foreground">{detail.customerName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-semibold text-foreground">{detail.serviceName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Staff</span><span className="font-semibold text-foreground">{detail.staffName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-semibold text-foreground">{detail.date}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-semibold text-foreground">{detail.startTime} - {detail.endTime}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-semibold text-foreground">${detail.amount}</span></div>
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Status</span><span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${statusStyles[detail.status]}`}>{detail.status}</span></div>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {nextStatus[detail.status] && (
                <Button size="sm" className="bg-primary text-primary-foreground" onClick={() => setStatus(detail.id, nextStatus[detail.status]!)}>
                  <Check className="h-4 w-4 mr-1" /> Mark as {nextStatus[detail.status]}
                </Button>
              )}
              {detail.status !== "cancelled" && detail.status !== "completed" && (
                <Button variant="ghost" size="sm" className="text-rose-500" onClick={() => setStatus(detail.id, "cancelled")}>
                  <XCircle className="h-4 w-4 mr-1" /> Cancel Booking
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => { setDetail(null); openEdit(detail) }}><Edit className="h-4 w-4 mr-1" /> Edit</Button>
            </div>
          </div>
        </div>
      )}

      {/* Create / edit form dialog */}
      {formMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm" onClick={() => setFormMode(null)}>
          <form className="glass-card rounded-3xl p-6 w-full max-w-lg space-y-4" onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); saveBooking() }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">{formMode === "create" ? "Create Booking" : "Edit Booking"}</h2>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setFormMode(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Customer</span>
                <input className={inputClass} list="customers" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} placeholder="Customer name" />
                <datalist id="customers">{mockCustomers.map(c => <option key={c.id} value={c.name} />)}</datalist>
              </label>
              <label className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Service</span>
                <select className={inputClass} value={form.serviceName} onChange={e => setForm({ ...form, serviceName: e.target.value })}>
                  {mockServices.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Staff</span>
                <select className={inputClass} value={form.staffName} onChange={e => setForm({ ...form, staffName: e.target.value })}>
                  {mockStaff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Date</span>
                <input type="date" className={inputClass} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </label>
              <label className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Start</span>
                <input type="time" className={inputClass} value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
              </label>
              <label className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">End</span>
                <input type="time" className={inputClass} value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Amount ($)</span>
                <input type="number" min="0" className={inputClass} value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" />
              </label>
            </div>
            {formError && <p className="text-xs font-semibold text-rose-500">{formError}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setFormMode(null)}>Cancel</Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground">Save Booking</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
