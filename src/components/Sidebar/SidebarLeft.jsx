import React, { useMemo } from 'react'
import { useJournal } from '../../context/JournalContext'
import './Sidebar.css'

const CATEGORIES = [
  { value: 'all',            label: 'All entries',        color: '#888' },
  { value: 'Learning',       label: 'Learnings',          color: '#1A6B9A' },
  { value: 'Good Practice',  label: 'Good Practices',     color: '#2E7D32' },
  { value: 'Reflection',     label: 'Reflections',        color: '#9A6A1A' },
  { value: 'Bug Analysis',   label: 'Bug Analysis',       color: '#8B2500' },
  { value: 'Tool/Technique', label: 'Tools & Techniques', color: '#5B2E8A' },
]

export default function SidebarLeft() {
  const { activeCategory, setActiveCategory, entries, setSearchQuery, navigateTo } = useJournal()

  const topicCounts = useMemo(() => {
    const counts = {}
    entries.forEach(e => e.tags.forEach(t => { counts[t] = (counts[t] || 0) + 1 }))
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 12)
  }, [entries])

  return (
    <aside className="sidebar-left">
      <div className="sidebar-section">
        <div className="sidebar-label">Filter by Category</div>
        <div className="tag-filter">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              className={activeCategory === cat.value ? 'active' : ''}
              onClick={() => { setActiveCategory(cat.value); navigateTo('feed') }}
            >
              <span className="tag-dot" style={{ background: cat.color }} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Topics</div>
        <div className="tag-filter topic-cloud">
          {topicCounts.length === 0
            ? <span className="no-topics">No tags yet</span>
            : topicCounts.map(([tag]) => (
                <button key={tag} onClick={() => { setSearchQuery(tag); navigateTo('feed') }}>
                  # {tag}
                </button>
              ))
          }
        </div>
      </div>
    </aside>
  )
}
