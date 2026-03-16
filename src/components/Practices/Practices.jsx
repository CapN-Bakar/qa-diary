import React, { useMemo } from 'react'
import { useJournal } from '../../context/JournalContext'
import './Practices.css'

export default function Practices() {
  const { entries, navigateTo } = useJournal()

  const practices = useMemo(
    () => entries
      .filter(e => e.category === 'Good Practice' && !e.isPrivate)
      .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [entries]
  )

  return (
    <div className="practices">
      <div className="view-header">
        <span className="view-title">📌 Good Practices</span>
        <span className="view-count">{practices.length} practices documented</span>
      </div>

      {practices.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📌</div>
          <div className="empty-title">No good practices yet</div>
          <div className="empty-sub">
            Entries with the <strong>Good Practice</strong> category appear here automatically.
          </div>
        </div>
      ) : (
        <div className="practices-grid">
          {practices.map((entry, i) => (
            <div
              key={entry.id}
              className="practice-card-item"
              onClick={() => navigateTo('detail', entry.id)}
            >
              <div className="practice-number">{String(i + 1).padStart(2, '0')}</div>
              <div className="practice-title">{entry.title}</div>
              <div className="practice-body">
                {entry.content.replace(/\n+/g, ' ').slice(0, 200)}
                {entry.content.length > 200 ? '…' : ''}
              </div>
              {entry.tags.length > 0 && (
                <div className="practice-tags">
                  {entry.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
