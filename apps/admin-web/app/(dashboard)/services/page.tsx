"use client"

import { useState } from "react"
import {
  Plus, Search, Eye, Edit, Trash2, Scissors, Clock, DollarSign, X, Check,
  Layers, Power,
} from "lucide-react"
import { mockServices, mockCategories } from "@/lib/mock-data"
import type { Service } from "@/types"
import { Button } from "@/components/ui/button"

type FormState = {
  name: string
  description: string
  duration: string
  price: string
  category: string
  isActive: boolean
}

const emptyForm: FormState = {
  name: "",
  description: "",
  duration: "60",
  price: "",
  category: mockCategories[0].name,
  isActive: true,
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(mockServices)
  const [categories, setCategories] = useState(mockCategories)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [formError, setFormError] = useState("")

  const [detail, setDetail] = useState<Service | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)
  const [catName, setCatName] = useState("")

  const filtered = services.filter(s => {
    const q = search.toLowerCase()
    return (
      (s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)) &&
      (categoryFilter === "all" || s.category === categoryFilter) &&
      (statusFilter === "all" || (statusFilter === "active" ? s.isActive : !s.isActive))
    )
  })

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setFormError(""); setFormMode("create") }
  const openEdit = (s: Service) => {
    setForm({ name: s.name, description: s.description, duration: String(s.duration), price: String(s.price), category: s.category, isActive: s.isActive })
    setEditingId(s.id); setFormError(""); setFormMode("edit")
  }

  const saveService = () => {
    if (!form.name.trim() || !form.price || !form.duration) {
      setFormError("Name, price and duration are required.")
      return
    }
    if (Number(form.price) <= 0 || Number(form.duration) <= 0) {
      setFormError("Price and duration must be greater than 0.")
      return
    }
    if (formMode === "create") {
      const nextId = String(Math.max(...services.map(s => Number(s.id)), 0) + 1)
      setServices(prev => [...prev, {
        id: nextId,
        name: form.name.trim(),
        description: form.description.trim(),
        duration: Number(form.duration),
        price: Number(form.price),
        category: form.category,
        isActive: form.isActive,
      }])
    } else {
      setServices(prev => prev.map(s => s.id === editingId ? {
        ...s,
        name: form.name.trim(),
        description: form.description.trim(),
        duration: Number(form.duration),
        price: Number(form.price),
        category: form.category,
        isActive: form.isActive,
      } : s))
    }
    setFormMode(null)
  }

  const toggleStatus = (id: string) =>
    setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s))

  const deleteService = () => {
    if (!deleteTarget) return
    setServices(prev => prev.filter(s => s.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const addCategory = () => {
    const name = catName.trim()
    if (!name || categories.some(c => c.name.toLowerCase() === name.toLowerCase())) return
    setCategories(prev => [...prev, { id: String(prev.length + 1), name, description: "", totalServices: 0 }])
    setCatName("")
  }

  const inputClass = "h-10 w-full rounded-xl glass-pill px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl shadow-2xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Services & Categories</h1>
          <p className="text-sm text-muted-foreground">Manage your service catalog, pricing and availability.</p>
        </div>
        <Button className="h-10 gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/20" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-table-container rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-white/15 dark:border-white/10 flex flex-col md:flex-row md:items-center gap-3 bg-white/20 dark:bg-zinc-900/30">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search services..."
                className="flex h-10 w-full rounded-lg glass-pill pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="h-10 px-3 rounded-lg glass-pill text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <select className="h-10 px-3 rounded-lg glass-pill text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/15 dark:border-white/10 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] bg-white/15 dark:bg-zinc-900/20">
                  <th className="py-4 px-6">Service</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-sm">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">No services found.</td>
                  </tr>
                ) : filtered.map(s => (
                  <tr key={s.id} className="hover:bg-white/5 transition-all">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Scissors className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{s.name}</p>
                          <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[240px]">{s.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-white/15 dark:bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Layers className="h-3 w-3" /> {s.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground font-medium">
                      <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {s.duration} min</span>
                    </td>
                    <td className="py-4 px-6 font-bold text-foreground">${s.price}</td>
                    <td className="py-4 px-6">
                      <button onClick={() => toggleStatus(s.id)} title="Toggle status">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${s.isActive ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-slate-500/10 text-slate-500 border border-slate-500/20"}`}>
                          <Power className="h-3 w-3" /> {s.isActive ? "Active" : "Inactive"}
                        </span>
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/10" onClick={() => setDetail(s)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/10" onClick={() => openEdit(s)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500/80 hover:text-rose-500 hover:bg-rose-500/10" onClick={() => setDeleteTarget(s)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Categories panel */}
        <div className="glass-card rounded-3xl p-6 shadow-2xl h-fit">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /> Categories</h2>
          <p className="text-xs text-muted-foreground mb-4">Organize your services.</p>
          <div className="flex gap-2 mb-4">
            <input
              placeholder="New category..."
              className="h-9 flex-1 rounded-xl glass-pill px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              value={catName}
              onChange={e => setCatName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addCategory()}
            />
            <Button size="sm" className="h-9 bg-primary text-primary-foreground" onClick={addCategory}><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="space-y-2">
            {categories.map(c => (
              <div key={c.id} className="flex items-center justify-between rounded-xl glass-pill px-3 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-foreground">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground">{services.filter(s => s.category === c.name).length} services</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm" onClick={() => setDetail(null)}>
          <div className="glass-card rounded-3xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Service Detail</p>
                <h2 className="text-xl font-bold text-foreground">{detail.name}</h2>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetail(null)}><X className="h-4 w-4" /></Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{detail.description}</p>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span className="font-semibold text-foreground">{detail.category}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-semibold text-foreground">{detail.duration} minutes</span></div>
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Price</span><span className="font-bold text-primary text-lg">${detail.price}</span></div>
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Status</span><span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${detail.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-500/10 text-slate-500"}`}>{detail.isActive ? "Active" : "Inactive"}</span></div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="ghost" size="sm" onClick={() => { setDetail(null); openEdit(detail) }}><Edit className="h-4 w-4 mr-1" /> Edit</Button>
              <Button size="sm" className="bg-primary text-primary-foreground" onClick={() => setDetail(null)}>Done</Button>
            </div>
          </div>
        </div>
      )}

      {/* Create / edit form */}
      {formMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm" onClick={() => setFormMode(null)}>
          <form className="glass-card rounded-3xl p-6 w-full max-w-lg space-y-4" onClick={e => e.stopPropagation()} onSubmit={e => { e.preventDefault(); saveService() }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">{formMode === "create" ? "Add Service" : "Edit Service"}</h2>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setFormMode(null)}><X className="h-4 w-4" /></Button>
            </div>
            <label className="space-y-1.5 block">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Name</span>
              <input className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Service name" />
            </label>
            <label className="space-y-1.5 block">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Description</span>
              <textarea className={`${inputClass} h-20 py-2 resize-none`} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe this service..." />
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Duration</span>
                <input type="number" min="1" className={inputClass} value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
              </label>
              <label className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Price ($)</span>
                <input type="number" min="0" className={inputClass} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0" />
              </label>
              <label className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Category</span>
                <select className={inputClass} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </label>
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 accent-primary" />
              Active and bookable
            </label>
            {formError && <p className="text-xs font-semibold text-rose-500">{formError}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setFormMode(null)}>Cancel</Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground"><Check className="h-4 w-4 mr-1" /> Save</Button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}>
          <div className="glass-card rounded-3xl p-6 w-full max-w-sm text-center" onClick={e => e.stopPropagation()}>
            <div className="mx-auto h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
              <Trash2 className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Delete service?</h2>
            <p className="text-sm text-muted-foreground mt-1">"{deleteTarget.name}" will be removed permanently.</p>
            <div className="flex justify-center gap-2 mt-5">
              <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button size="sm" className="bg-rose-500 text-white hover:bg-rose-600" onClick={deleteService}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
