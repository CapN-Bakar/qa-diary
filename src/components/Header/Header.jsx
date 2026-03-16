import React from 'react'
import { useJournal } from '../../context/JournalContext'
import './Header.css'

export default function Header() {
  const { currentView, unlocked, navigateTo, lock, setShowLoginModal, openAddModal } = useJournal()

  return (
    <header className="header">
      <div className="logo">
        <span className="logo-title">QA Journal</span>
        <span className="logo-sub">Software Testing Diary</span>
      </div>

      <nav className="nav">
        <button className={currentView === 'feed' ? 'active' : ''} onClick={() => navigateTo('feed')}>
          📖 Feed
        </button>
        <button className={currentView === 'practices' ? 'active' : ''} onClick={() => navigateTo('practices')}>
          📌 Good Practices
        </button>

        {/* All Entries tab — owner only */}
        {unlocked && (
          <button className={currentView === 'all' ? 'active' : ''} onClick={() => navigateTo('all')}>
            🗒️ All Entries
          </button>
        )}

        {/* New Entry button — owner only */}
        {unlocked && (
          <button className="new-entry-btn" onClick={() => openAddModal()}>
            + New Entry
          </button>
        )}

        {/* Owner login / logout */}
        <button
          className={`owner-btn${unlocked ? ' unlocked' : ''}`}
          onClick={() => unlocked ? lock() : setShowLoginModal(true)}
        >
          {unlocked ? '🔓 Owner Mode' : '🔑 Owner Login'}
        </button>
      </nav>
    </header>
  )
}
