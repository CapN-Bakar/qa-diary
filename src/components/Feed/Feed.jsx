import React, { useMemo, useState, useEffect } from 'react'
import { useJournal } from '../../context/JournalContext'
import EntryCard from '../EntryCard/EntryCard'
import { QUOTES } from '../../data/sampleData'
import { getRandomQuote } from '../../utils/helpers'
import './Feed.css'

export default function Feed({ showAll = false }) {
  const { entries, unlocked, activeCategory, searchQuery, setSearchQuery } = useJournal()
  const [quote]       = useState(() => getRandomQuote(QUOTES))
  const [localSearch, setLocalSearch] = useState(searchQuery)

  useEffect(() => { setLocalSearch(searchQuery) }, [searchQuery])

  function handleSearchChange(e) {
    const val = e.target.value
    setLocalSearch(val)
    setSearchQuery(val)
  }

  const filtered = useMemo(() => {
    const q = localSearch.toLowerCase()
    return entries
      .filter(e => {
        // Visitors only see public entries
        if (!showAll && e.isPrivate && !unlocked) return false
        if (!showAll && activeCategory !== 'all' && e.category !== activeCategory) return false
        if (q) return (
          e.title.toLowerCase().includes(q) ||
          e.content.toLowerCase().includes(q) ||
          e.tags.join(' ').toLowerCase().includes(q)
        )
        return true
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [entries, activeCategory, localSearch, showAll, unlocked])

  const title = showAll
    ? 'All Entries (Owner View)'
    : activeCategory === 'all' ? 'All Entries' : activeCategory

  return (
    <div className="feed">
      {!showAll && (
        <div className="daily-quote">
          <p>"{quote.text}"</p>
          <span>— {quote.author}</span>
        </div>
      )}

      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search entries…"
          value={localSearch}
          onChange={handleSearchChange}
        />
      </div>

      <div className="view-header">
        <span className="view-title">{title}</span>
        <span className="view-count">{filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📔</div>
          <div className="empty-title">No entries found</div>
          <div className="empty-sub">Try a different search or category.</div>
        </div>
      ) : (
        <div className="entries-grid">
          {filtered.map(entry => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
