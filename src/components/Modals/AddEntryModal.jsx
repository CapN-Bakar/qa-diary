import React, { useState, useEffect } from 'react'
import { useJournal } from '../../context/JournalContext'
import './Modal.css'

const CATEGORIES = ['Learning', 'Good Practice', 'Reflection', 'Bug Analysis', 'Tool/Technique']
const CAT_EMOJI  = { 'Learning': '📚', 'Good Practice': '✅', 'Reflection': '💭', 'Bug Analysis': '🐛', 'Tool/Technique': '🛠️' }
const today      = new Date().toISOString().slice(0, 10)

export default function AddEntryModal() {
  const { entries, editingId, setShowAddModal, addEntry, updateEntry, navigateTo } = useJournal()
  const editing = editingId ? entries.find(e => e.id === editingId) : null

  const [form, setForm] = useState({
    date:      editing?.date      ?? today,
    category:  editing?.category  ?? 'Learning',
    title:     editing?.title     ?? '',
    content:   editing?.content   ?? '',
    tags:      editing?.tags?.join(', ') ?? '',
    isPrivate: editing?.isPrivate ?? false,
  })

  useEffect(() => {
    if (editing) setForm({
      date: editing.date, category: editing.category,
      title: editing.title, content: editing.content,
      tags: editing.tags.join(', '), isPrivate: editing.isPrivate,
    })
  }, [editingId]) // eslint-disable-line

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  function handleSave() {
    if (!form.title.trim())   { alert('Please enter a title.');      return }
    if (!form.content.trim()) { alert('Please write some content.'); return }
    if (!form.date)            { alert('Please select a date.');      return }

    const entry = {
      date: form.date, category: form.category,
      title: form.title.trim(), content: form.content.trim(),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      isPrivate: form.isPrivate,
    }

    if (editingId) {
      updateEntry(editingId, entry)
      setShowAddModal(false)
      navigateTo('detail', editingId)
    } else {
      addEntry(entry)
      setShowAddModal(false)
      navigateTo('feed')
    }
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && setShowAddModal(false)}>
      <div className="modal">
        <button className="close-btn" onClick={() => setShowAddModal(false)}>✕</button>
        <div className="modal-title">{editingId ? '✏️ Edit Entry' : '📝 New Entry'}</div>

        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{CAT_EMOJI[cat]} {cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            placeholder="What did you learn or discover today?"
            value={form.title}
            onChange={e => set('title', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            placeholder="Write your thoughts, learnings, examples, code snippets…"
            value={form.content}
            onChange={e => set('content', e.target.value)}
          />
          <div className="char-count">{form.content.length} characters</div>
        </div>

        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            placeholder="e.g. selenium, regression, boundary testing"
            value={form.tags}
            onChange={e => set('tags', e.target.value)}
          />
        </div>

        <div className="form-group">
          <div className="privacy-toggle">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={form.isPrivate}
                onChange={e => set('isPrivate', e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
            <span className="toggle-label">
              <strong>Private Entry</strong> — only visible to you (owner)
            </span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {editingId ? 'Update Entry' : 'Save Entry'}
          </button>
        </div>
      </div>
    </div>
  )
}
