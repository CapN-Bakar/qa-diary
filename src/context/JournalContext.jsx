import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { uid, hashPin } from '../utils/helpers'

const OWNER_PIN1_HASH = '0985b889a1fe4f4e1fb925061ac6fb2247f10875f5fcbe63eec2ab55ed68970e'
const OWNER_PIN2_HASH = '6c94e35ccc352d4e9ef0b99562cff995a5741ce8de8ad11b568892934daee366'

const JournalContext = createContext(null)

export function JournalProvider({ children }) {
  const [entries, setEntries]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [unlocked, setUnlocked] = useState(false)

  const [currentView, setCurrentView]         = useState('feed')
  const [activeCategory, setActiveCategory]   = useState('all')
  const [selectedEntryId, setSelectedEntryId] = useState(null)
  const [prevView, setPrevView]               = useState('feed')
  const [searchQuery, setSearchQuery]         = useState('')
  const [showAddModal, setShowAddModal]       = useState(false)
  const [showLoginModal, setShowLoginModal]   = useState(false)
  const [editingId, setEditingId]             = useState(null)

  useEffect(() => { fetchEntries() }, [unlocked]) // eslint-disable-line

  async function fetchEntries() {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('entries')
        .select('*')
        .order('date', { ascending: false })

      if (!unlocked) query = query.eq('is_private', false)

      const { data, error } = await query
      if (error) throw error
      setEntries(data.map(mapFromDB))
    } catch (err) {
      console.error('Failed to fetch entries:', err)
      setError('Failed to load entries. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  function mapFromDB(row) {
    return {
      id:        row.id,
      date:      row.date,
      category:  row.category,
      title:     row.title,
      content:   row.content,
      tags:      row.tags || [],
      isPrivate: row.is_private,
      images:    row.images || [],
    }
  }

  function mapToDB(entry) {
    return {
      id:         entry.id,
      date:       entry.date,
      category:   entry.category,
      title:      entry.title,
      content:    entry.content,
      tags:       entry.tags || [],
      is_private: entry.isPrivate,
      images:     entry.images || [],
    }
  }

  const addEntry = useCallback(async (data) => {
    const entry = { ...data, id: uid() }
    const { error } = await supabase.from('entries').insert(mapToDB(entry))
    if (error) { alert('Failed to save entry: ' + error.message); return }
    setEntries(prev => [entry, ...prev])
  }, [])

  const updateEntry = useCallback(async (id, data) => {
    const entry = { ...data, id }
    const { error } = await supabase.from('entries').update(mapToDB(entry)).eq('id', id)
    if (error) { alert('Failed to update entry: ' + error.message); return }
    setEntries(prev => prev.map(e => e.id === id ? entry : e))
  }, [])

  const deleteEntry = useCallback(async (id) => {
    const { error } = await supabase.from('entries').delete().eq('id', id)
    if (error) { alert('Failed to delete entry: ' + error.message); return }
    setEntries(prev => prev.filter(e => e.id !== id))
  }, [])

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
      entries, loading, error, unlocked,
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
