import React, { createContext, useContext, useState, useCallback } from 'react'
import { SAMPLE_ENTRIES } from '../data/sampleData'
import { uid, hashPin } from '../utils/helpers'

/**
 * OWNER AUTH — dual PIN with hardcoded SHA-256 hashes
 *
 * PINs are never stored in localStorage or anywhere on the client.
 * The hashes below are baked into the source code at build time.
 * Visitors can never trigger a "setup" flow — there is none.
 *
 * To change PINs later:
 *   1. Run in terminal:
 *      node -e "const c=require('crypto'); console.log(c.createHash('sha256').update('YOURNEWPIN').digest('hex'))"
 *   2. Replace the hash constants below
 *   3. Redeploy to Netlify
 */
const OWNER_PIN1_HASH = '0985b889a1fe4f4e1fb925061ac6fb2247f10875f5fcbe63eec2ab55ed68970e'
const OWNER_PIN2_HASH = '6c94e35ccc352d4e9ef0b99562cff995a5741ce8de8ad11b568892934daee366'

const JournalContext = createContext(null)

export function JournalProvider({ children }) {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('qajournal_entries')
    if (saved) return JSON.parse(saved)
    const samples = SAMPLE_ENTRIES.map(e => ({ ...e, id: uid() }))
    localStorage.setItem('qajournal_entries', JSON.stringify(samples))
    return samples
  })

  const [unlocked, setUnlocked]               = useState(false)
  const [currentView, setCurrentView]         = useState('feed')
  const [activeCategory, setActiveCategory]   = useState('all')
  const [selectedEntryId, setSelectedEntryId] = useState(null)
  const [prevView, setPrevView]               = useState('feed')
  const [searchQuery, setSearchQuery]         = useState('')
  const [showAddModal, setShowAddModal]       = useState(false)
  const [showLoginModal, setShowLoginModal]   = useState(false)
  const [editingId, setEditingId]             = useState(null)

  const saveEntries = useCallback((updated) => {
    setEntries(updated)
    localStorage.setItem('qajournal_entries', JSON.stringify(updated))
  }, [])

  const addEntry    = useCallback((data) => saveEntries([{ ...data, id: uid() }, ...entries]), [entries, saveEntries])
  const updateEntry = useCallback((id, data) => saveEntries(entries.map(e => e.id === id ? { ...data, id } : e)), [entries, saveEntries])
  const deleteEntry = useCallback((id) => saveEntries(entries.filter(e => e.id !== id)), [entries, saveEntries])

  const unlock = useCallback(async (p1, p2) => {
    const [h1, h2] = await Promise.all([hashPin(p1), hashPin(p2)])
    if (h1 !== OWNER_PIN1_HASH) return { ok: false, error: 'First PIN is incorrect.' }
    if (h2 !== OWNER_PIN2_HASH) return { ok: false, error: 'Second PIN is incorrect.' }
    setUnlocked(true)
    return { ok: true }
  }, [])

  const lock = useCallback(() => {
    setUnlocked(false)
    setCurrentView(v => v === 'all' ? 'feed' : v)
  }, [])

  const navigateTo = useCallback((view, entryId = null) => {
    if (view === 'detail' && entryId) {
      setPrevView(cur => cur !== 'detail' ? cur : prevView)
      setSelectedEntryId(entryId)
    }
    setCurrentView(view)
  }, [prevView])

  const openAddModal = useCallback((id = null) => {
    setEditingId(id)
    setShowAddModal(true)
  }, [])

  return (
    <JournalContext.Provider value={{
      entries, unlocked,
      currentView, activeCategory, selectedEntryId, prevView, searchQuery,
      showAddModal, showLoginModal, editingId,
      setActiveCategory, setSearchQuery,
      setShowAddModal, setShowLoginModal,
      addEntry, updateEntry, deleteEntry,
      unlock, lock,
      navigateTo, openAddModal,
    }}>
      {children}
    </JournalContext.Provider>
  )
}

export function useJournal() {
  const ctx = useContext(JournalContext)
  if (!ctx) throw new Error('useJournal must be used inside JournalProvider')
  return ctx
}
