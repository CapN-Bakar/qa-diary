import React from 'react'
import { useJournal } from '../../context/JournalContext'
import { formatDate, getCatClass } from '../../utils/helpers'
import './EntryDetail.css'

export default function EntryDetail() {
  const {
    entries, selectedEntryId, prevView,
    unlocked, deleteEntry, openAddModal, navigateTo,
  } = useJournal()

  const entry = entries.find(e => e.id === selectedEntryId)

  if (!entry) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <div className="empty-title">Entry not found</div>
        <button className="btn btn-secondary" onClick={() => navigateTo('feed')}>← Back to Feed</button>
      </div>
    )
  }

  if (entry.isPrivate && !unlocked) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔒</div>
        <div className="empty-title">Private entry</div>
        <div className="empty-sub">Owner login required to view this entry.</div>
        <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => navigateTo('feed')}>
          ← Back
        </button>
      </div>
    )
  }

  function handleDelete() {
    if (window.confirm('Delete this entry? This cannot be undone.')) {
      deleteEntry(entry.id)
      navigateTo(prevView)
    }
  }

  return (
    <div className="entry-detail">
      <button className="back-btn" onClick={() => navigateTo(prevView)}>← Back</button>

      <div className="detail-meta">
        <span className="detail-date">{formatDate(entry.date)}</span>
        <span className={`entry-category ${getCatClass(entry.category)}`}>{entry.category}</span>
        {entry.isPrivate && <span className="private-badge">🔒 Private</span>}
      </div>

      <h1 className="detail-title">{entry.title}</h1>
      <div className="detail-body">{entry.content}</div>

      {entry.tags.length > 0 && (
        <div className="detail-tags">
          {entry.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      )}

      {/* Owner-only actions — no Change PINs button since PINs are hardcoded in source */}
      {unlocked && (
        <div className="detail-actions">
          <button className="btn btn-secondary" onClick={() => openAddModal(entry.id)}>✏️ Edit</button>
          <button className="btn btn-danger" onClick={handleDelete}>🗑️ Delete</button>
        </div>
      )}
    </div>
  )
}
