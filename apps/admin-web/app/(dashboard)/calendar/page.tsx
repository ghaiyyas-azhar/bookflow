"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, Clock, User, Scissors } from "lucide-react"
import { mockBookings } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"

type View = "month" | "week" | "day"

const TODAY = new Date(2024, 9, 20)

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8)

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export default function CalendarPage() {
  const [view, setView] = useState<View>("month")
  const [cursor, setCursor] = useState(() => new Date(2026, 10, 20))
  const [selectedDate, setSelectedDate] = useState("2026-10-20")

  const bookingsByDate = useMemo(() => {
    const map: Record<string, typeof mockBookings> = {}
    mockBookings.forEach(b => {
      (map[b.date] = map[b.date] ?? []).push(b)
    })
    return map
  }, [])

  const shift = (dir: number) => {
    const d = new Date(cursor)
    if (view === "month") d.setMonth(d.getMonth() + dir)
    if (view === "week") d.setDate(d.getDate() + dir * 7)
    if (view === "day") d.setDate(d.getDate() + dir)
    setCursor(d)
    if (view === "day") setSelectedDate(toISO(d))
  }

  const monthDays = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const start = new Date(first)
    start.setDate(first.getDate() - first.getDay())
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      return d
    })
  }, [cursor])

  const weekDays = useMemo(() => {
    const start = new Date(cursor)
    start.setDate(cursor.getDate() - cursor.getDay())
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      return d
    })
  }, [cursor])

  const dayBookings = bookingsByDate[selectedDate] ?? []

  const title = view === "month"
    ? cursor.toLocaleString("default", { month: "long", year: "numeric" })
    : view === "week"
      ? `Week of ${weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
      : cursor.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl shadow-2xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">Appointments, working hours and staff schedules.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="h-10 w-10 border-white/10 hover:bg-white/5" onClick={() => shift(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-10 border-white/10 hover:bg-white/5" onClick={() => { setCursor(TODAY); setSelectedDate(toISO(TODAY)) }}>
            Today
          </Button>
          <Button variant="outline" size="icon" className="h-10 w-10 border-white/10 hover:bg-white/5" onClick={() => shift(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="ml-2 inline-flex rounded-xl glass-pill p-1 text-xs">
            {(["month", "week", "day"] as View[]).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all capitalize ${view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === "month" && (
        <div className="glass-table-container rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-7 border-b border-white/15 dark:border-white/10 bg-white/20 dark:bg-zinc-900/30">
            {WEEKDAYS.map(d => (
              <div key={d} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthDays.map((d, i) => {
              const iso = toISO(d)
              const inMonth = d.getMonth() === cursor.getMonth()
              const isToday = iso === toISO(TODAY)
              const dayBookings = bookingsByDate[iso] ?? []
              return (
                <button
                  key={i}
                  onClick={() => { setSelectedDate(iso); setCursor(new Date(d)); setView("day") }}
                  className={`min-h-[92px] p-2 text-left border-r border-b border-white/10 dark:border-white/5 transition-all hover:bg-white/10 ${!inMonth && "opacity-35"} ${iso === selectedDate && "bg-primary/10"}`}
                >
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${isToday ? "bg-primary text-primary-foreground" : "text-foreground"}`}>
                    {d.getDate()}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayBookings.slice(0, 2).map(b => (
                      <div key={b.id} className="truncate rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                        {b.startTime} {b.customerName}
                      </div>
                    ))}
                    {dayBookings.length > 2 && (
                      <div className="text-[10px] font-bold text-muted-foreground">+{dayBookings.length - 2} more</div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {view === "week" && (
        <div className="glass-table-container rounded-3xl shadow-2xl overflow-x-auto">
          <div className="grid min-w-[720px] grid-cols-8 border-b border-white/15 dark:border-white/10 bg-white/20 dark:bg-zinc-900/30">
            <div className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Hour</div>
            {weekDays.map(d => {
              const isToday = toISO(d) === toISO(TODAY)
              return (
                <div key={d.toISOString()} className={`py-3 text-center text-xs font-bold ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                  {WEEKDAYS[d.getDay()]} {d.getDate()}
                </div>
              )
            })}
          </div>
          <div className="grid min-w-[720px] grid-cols-8">
            {HOURS.map(hour => (
              <div key={hour} className="contents">
                <div className="border-b border-white/10 dark:border-white/5 px-2 py-2 text-right text-[10px] font-semibold text-muted-foreground">
                  {String(hour).padStart(2, "0")}:00
                </div>
                {weekDays.map(d => {
                  const iso = toISO(d)
                  const atHour = (bookingsByDate[iso] ?? []).find(b => Number(b.startTime.split(":")[0]) === hour)
                  return (
                    <div key={iso + hour} className="min-h-[52px] border-b border-r border-white/10 dark:border-white/5 p-1 transition-colors hover:bg-white/5">
                      {atHour && (
                        <div className="rounded-lg bg-primary/15 px-1.5 py-1 text-[10px] font-semibold text-primary border-l-2 border-primary">
                          {atHour.startTime} {atHour.customerName}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "day" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-table-container rounded-3xl shadow-2xl p-4 space-y-2">
            {HOURS.map(hour => {
              const atHour = dayBookings.filter(b => Number(b.startTime.split(":")[0]) === hour)
              return (
                <div key={hour} className="flex gap-4">
                  <div className="w-14 shrink-0 pt-2 text-right text-[11px] font-bold text-muted-foreground">{String(hour).padStart(2, "0")}:00</div>
                  <div className="flex-1 min-h-[56px] rounded-xl border border-dashed border-white/15 dark:border-white/10 p-2 transition-colors hover:bg-white/5">
                    {atHour.map(b => (
                      <div key={b.id} className="flex items-center gap-3 rounded-xl bg-primary/10 px-3 py-2 border-l-2 border-primary">
                        <Clock className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{b.customerName} · {b.serviceName}</p>
                          <p className="text-[11px] text-muted-foreground">{b.startTime} - {b.endTime} · {b.staffName}</p>
                        </div>
                      </div>
                    ))}
                    {atHour.length === 0 && <p className="text-[11px] text-muted-foreground/50 pt-1">Available</p>}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="glass-card rounded-3xl p-6 shadow-2xl h-fit">
            <h2 className="text-lg font-bold text-foreground mb-1">Day Schedule</h2>
            <p className="text-xs text-muted-foreground mb-4">Staff assignments for {selectedDate}</p>
            {dayBookings.length === 0 ? (
              <div className="rounded-xl bg-white/10 dark:bg-white/5 p-4 text-center">
                <p className="text-sm text-muted-foreground">No appointments on this day.</p>
                <p className="text-[11px] text-muted-foreground/70 mt-1">All staff available.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dayBookings.map(b => (
                  <div key={b.id} className="rounded-2xl glass-pill p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">{b.startTime} - {b.endTime}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                        b.status === "confirmed" ? "bg-emerald-500/15 text-emerald-500" :
                        b.status === "pending" ? "bg-amber-500/15 text-amber-500" : "bg-blue-500/15 text-blue-500"
                      }`}>{b.status}</span>
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-foreground flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {b.customerName}</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5"><Scissors className="h-3.5 w-3.5" /> {b.serviceName} · {b.staffName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
