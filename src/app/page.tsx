"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Zap, UtensilsCrossed, ChevronRight, X, Star,
  CheckCircle2, DollarSign, Globe, Info, FileText,
  Filter, LayoutGrid, Layers, ChevronDown, Check
} from "lucide-react"
import integrationsData from "@/data/integrations.json"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedProduct, setSelectedProduct] = useState("all")
  const [selectedIntegId, setSelectedIntegId] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Derived state
  const selectedIntegration = useMemo(() =>
    integrationsData.integrations.find(i => i.id === selectedIntegId),
    [selectedIntegId]
  )

  const filteredIntegrations = useMemo(() => {
    return integrationsData.integrations.filter(integ => {
      const matchesSearch = integ.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        integ.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        integ.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(integ.category)

      const matchesProduct = selectedProduct === "all" ||
        integ.compatibility.some(c => c.toLowerCase().includes(selectedProduct.toLowerCase()))

      return matchesSearch && matchesCategory && matchesProduct
    })
  }, [searchQuery, selectedCategories, selectedProduct])

  // Group by category for the list
  const groupedIntegrations = useMemo(() => {
    const groups: { [key: string]: any[] } = {}
    filteredIntegrations.forEach(integ => {
      if (!groups[integ.category]) groups[integ.category] = []
      groups[integ.category].push(integ)
    })
    return groups
  }, [filteredIntegrations])

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-rose-500/30 pb-24">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-1/2 bg-rose-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-md mx-auto p-6 space-y-8">

        {/* Header */}
        <header className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">SpotOn Partner Integrations</h1>
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative group sticky top-4 z-40">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Do we have that integration?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl py-5 pl-12 pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all placeholder:text-slate-600 backdrop-blur-xl shadow-2xl"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Selected Integration Detail (The "Image" underneath the input) */}
        <AnimatePresence mode="wait">
          {selectedIntegId && selectedIntegration && (
            <motion.div
              layoutId={selectedIntegId}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative p-8 rounded-[2.5rem] bg-slate-900/60 border border-white/5 shadow-2xl backdrop-blur-md overflow-hidden"
            >
              <button
                onClick={() => setSelectedIntegId(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <X className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </button>

              <div className="space-y-10">
                {/* Hero Inside Detail */}
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-xl">
                    {selectedIntegration.logo ? (
                      <img src={selectedIntegration.logo} alt={selectedIntegration.name} className="w-full h-full object-contain p-3" />
                    ) : (
                      <span className="text-3xl font-black text-rose-500/40">{selectedIntegration.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold leading-tight">{selectedIntegration.name}</h2>
                      {selectedIntegration.preferred && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                      {integrationsData.categories.find(c => c.id === selectedIntegration.category)?.name}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {selectedIntegration.compatibility.map((c: string) => (
                    <span key={c} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400">
                      {c}
                    </span>
                  ))}
                </div>

                {/* Framework Sections */}
                <div className="space-y-8 text-[14px]">
                  {selectedIntegration.description && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-500 font-black uppercase text-[9px] tracking-widest">
                        <FileText className="w-3 h-3" /> Description
                      </div>
                      <p className="text-slate-300 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">{selectedIntegration.description}</p>
                    </div>
                  )}

                  {selectedIntegration.integration && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-500 font-black uppercase text-[9px] tracking-widest">
                        <Zap className="w-3 h-3" /> Integration
                      </div>
                      <p className="text-slate-300 leading-relaxed bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 border-dashed">{selectedIntegration.integration}</p>
                    </div>
                  )}

                  {selectedIntegration.benefits && selectedIntegration.benefits.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-500 font-black uppercase text-[9px] tracking-widest">
                        <CheckCircle2 className="w-3 h-3" /> Benefits
                      </div>
                      <div className="grid gap-2">
                        {selectedIntegration.benefits.map((b: string, i: number) => (
                          <div key={i} className="flex gap-3 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-300 text-sm">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {selectedIntegration.website && selectedIntegration.website !== "INDEX" && (
                    <a
                      href={selectedIntegration.website.startsWith('http') ? selectedIntegration.website : `https://${selectedIntegration.website}`}
                      target="_blank"
                      className="flex-1 bg-rose-500 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm hover:bg-rose-600 active:scale-95 transition-all shadow-lg shadow-rose-500/20"
                    >
                      <Globe className="w-4 h-4" /> Visit Site
                    </a>
                  )}
                  {selectedIntegration.startingPrice && selectedIntegration.startingPrice !== "INDEX" && (
                    <div className="px-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-center">
                      <span className="text-[8px] font-black uppercase text-slate-500">From</span>
                      <span className="text-sm font-bold tabular-nums">{selectedIntegration.startingPrice}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filtering Controls */}
        <div className="space-y-4">
          {/* Product Line */}
          <div className="flex p-1 bg-slate-900/50 rounded-2xl border border-slate-800">
            {["all", "express", "rpos"].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedProduct(p)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all 
                  ${selectedProduct === p
                    ? p === 'express' ? 'bg-amber-500 text-slate-950 shadow-xl shadow-amber-500/20'
                      : p === 'rpos' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20'
                        : 'bg-rose-500 text-white shadow-xl'
                    : 'text-slate-500 hover:text-slate-300'}`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Category Dropdown & Active Chips */}
          <div className="space-y-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Filter className="w-4 h-4 text-slate-500 group-hover:text-rose-500 transition-colors" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    {selectedCategories.length > 0 ? `${selectedCategories.length} Types Selected` : 'Filter By Type'}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-3 p-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto backdrop-blur-xl"
                  >
                    <div className="grid gap-1">
                      {integrationsData.categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => toggleCategory(cat.id)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${selectedCategories.includes(cat.id) ? 'bg-rose-500/10 text-rose-500' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
                        >
                          <span className="text-xs font-bold uppercase tracking-wider">{cat.name}</span>
                          {selectedCategories.includes(cat.id) && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Active Chips (Text Chips) */}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map(catId => (
                  <button
                    key={catId}
                    onClick={() => toggleCategory(catId)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-rose-500/50 transition-colors group"
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-rose-400">
                      {integrationsData.categories.find(c => c.id === catId)?.name}
                    </span>
                    <X className="w-3 h-3 text-slate-600 group-hover:text-rose-500" />
                  </button>
                ))}
                <button
                  onClick={() => setSelectedCategories([])}
                  className="text-[9px] font-black uppercase tracking-widest text-rose-500/60 hover:text-rose-500 px-2 py-1.5"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* List View */}
        <div className="space-y-12">
          {Object.entries(groupedIntegrations).map(([catId, items]) => (
            <section key={catId} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/50">
                <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                  {integrationsData.categories.find(c => c.id === catId)?.name}
                </h3>
                <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] text-slate-500 font-bold">{items.length}</span>
              </div>
              <div className="grid gap-3">
                {items.map(integ => (
                  <motion.button
                    layoutId={integ.id}
                    key={integ.id}
                    onClick={() => {
                      setSelectedIntegId(integ.id)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className={`group w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${selectedIntegId === integ.id ? 'bg-rose-500 border-rose-500' : 'bg-slate-900/40 border-slate-800/50 hover:bg-slate-900 hover:border-slate-700'}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${selectedIntegId === integ.id ? 'bg-white/20 border-white/20' : 'bg-white/5 border-white/10'}`}>
                      {integ.logo ? (
                        <img src={integ.logo} alt={integ.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <span className={`text-xl font-black ${selectedIntegId === integ.id ? 'text-white' : 'text-rose-500/50 group-hover:text-rose-500 transition-colors'}`}>{integ.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <h4 className={`text-base font-bold truncate ${selectedIntegId === integ.id ? 'text-white' : 'text-slate-100'}`}>{integ.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        {integ.compatibility.slice(0, 2).map((c: string) => (
                          <span key={c} className={`text-[8px] font-black uppercase tracking-widest ${selectedIntegId === integ.id ? 'text-white/60' : 'text-slate-500'}`}>{c}</span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform ${selectedIntegId === integ.id ? 'text-white' : 'text-slate-700 group-hover:translate-x-1'}`} />
                  </motion.button>
                ))}
              </div>
            </section>
          ))}

          {filteredIntegrations.length === 0 && (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto border border-slate-800">
                <Search className="w-6 h-6 text-slate-700" />
              </div>
              <p className="text-slate-500 text-sm italic">"We don't have that yet... but tell us what you need."</p>
            </div>
          )}
        </div>

        <footer className="pt-10 text-center">
          <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.3em]">Built for the best by SpotOn</p>
        </footer>

      </div>
    </main>
  )
}
