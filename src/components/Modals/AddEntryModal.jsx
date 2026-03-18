import React, { useState, useEffect, useRef, useCallback } from "react";
import { useJournal } from "../../context/JournalContext";
import { supabase } from "../../lib/supabase";
import { uid } from "../../utils/helpers";
import "./Modal.css";

const CATEGORIES = [
  "Learning",
  "Good Practice",
  "Reflection",
  "Bug Analysis",
  "Tool/Technique",
];
const CAT_EMOJI = {
  Learning: "📚",
  "Good Practice": "✅",
  Reflection: "💭",
  "Bug Analysis": "🐛",
  "Tool/Technique": "🛠️",
};
const today = new Date().toISOString().slice(0, 10);

export default function AddEntryModal() {
  const {
    entries,
    editingId,
    setShowAddModal,
    addEntry,
    updateEntry,
    navigateTo,
  } = useJournal();
  const editing = editingId ? entries.find((e) => e.id === editingId) : null;

  const [form, setForm] = useState({
    date: editing?.date ?? today,
    category: editing?.category ?? "Learning",
    title: editing?.title ?? "",
    tags: editing?.tags?.join(", ") ?? "",
    isPrivate: editing?.isPrivate ?? false,
  });

  const [images, setImages] = useState(editing?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [contentLength, setContentLength] = useState(0);
  const fileInputRef = useRef();
  const editorRef = useRef();

  // Populate editor content when editing an existing entry
  useEffect(() => {
    if (editing && editorRef.current) {
      editorRef.current.innerHTML = editing.content || "";
      setContentLength(editorRef.current.innerText.length);
      setImages(editing.images ?? []);
      setForm({
        date: editing.date,
        category: editing.category,
        title: editing.title,
        tags: editing.tags.join(", "),
        isPrivate: editing.isPrivate,
      });
    }
  }, [editingId]); // eslint-disable-line

  const set = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // ── WYSIWYG FORMATTING ──
  function applyFormat(command, value = null) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  }

  function handleEditorInput() {
    setContentLength(editorRef.current?.innerText?.length ?? 0);
  }

  // Prevent paste from bringing in external HTML/styles — paste as plain text
  function handleEditorPaste(e) {
    const items = Array.from(e.clipboardData?.items || []);
    const imageItem = items.find((i) => i.type.startsWith("image/"));

    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file)
        uploadFile(file).then((result) => {
          if (result) setImages((prev) => [...prev, result]);
        });
      return;
    }

    // Plain text paste only — strip external formatting
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }

  // ── IMAGE UPLOAD ──
  async function uploadFile(file) {
    if (!file) return null;
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are supported.");
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File too large. Max size is 5MB.");
      return null;
    }
    setUploadError("");
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const filename = `${uid()}.${ext}`;
      const { error } = await supabase.storage
        .from("entry-images")
        .upload(filename, file, { contentType: file.type });
      if (error) throw error;
      const {
        data: { publicUrl },
      } = supabase.storage.from("entry-images").getPublicUrl(filename);
      return { url: publicUrl, name: file.name, type: file.type };
    } catch (err) {
      setUploadError("Upload failed: " + err.message);
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleFileChange(e) {
    for (const file of Array.from(e.target.files)) {
      const result = await uploadFile(file);
      if (result) setImages((prev) => [...prev, result]);
    }
    e.target.value = "";
  }

  async function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    for (const file of Array.from(e.dataTransfer.files)) {
      const result = await uploadFile(file);
      if (result) setImages((prev) => [...prev, result]);
    }
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    const content = editorRef.current?.innerHTML?.trim() ?? "";
    const rawText = editorRef.current?.innerText?.trim() ?? "";

    if (!form.title.trim()) {
      alert("Please enter a title.");
      return;
    }
    if (!rawText) {
      alert("Please write some content.");
      return;
    }
    if (!form.date) {
      alert("Please select a date.");
      return;
    }

    const entry = {
      date: form.date,
      category: form.category,
      title: form.title.trim(),
      content, // stored as HTML
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isPrivate: form.isPrivate,
      images,
    };

    if (editingId) {
      updateEntry(editingId, entry);
      setShowAddModal(false);
      navigateTo("detail", editingId);
    } else {
      addEntry(entry);
      setShowAddModal(false);
      navigateTo("feed");
    }
  }

  const isGif = (url) => url.toLowerCase().includes(".gif");

  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
    >
      <div className="modal">
        <button className="close-btn" onClick={() => setShowAddModal(false)}>
          ✕
        </button>
        <div className="modal-title">
          {editingId ? "✏️ Edit Entry" : "📝 New Entry"}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CAT_EMOJI[cat]} {cat}
                </option>
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
            onChange={(e) => set("title", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Content</label>

          {/* ── WYSIWYG TOOLBAR ── */}
          <div className="format-toolbar">
            <button
              type="button"
              className="format-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat("bold");
              }}
              title="Bold (Ctrl+B)"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              className="format-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat("italic");
              }}
              title="Italic (Ctrl+I)"
            >
              <em>I</em>
            </button>
            <button
              type="button"
              className="format-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat("underline");
              }}
              title="Underline (Ctrl+U)"
            >
              <span style={{ textDecoration: "underline", fontSize: 13 }}>
                U
              </span>
            </button>
            <div className="toolbar-divider" />
            <button
              type="button"
              className="format-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat("insertUnorderedList");
              }}
              title="Bullet list"
            >
              ☰
            </button>
            <button
              type="button"
              className="format-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat("insertOrderedList");
              }}
              title="Numbered list"
            >
              ≡
            </button>
            <div className="toolbar-divider" />
            <span className="toolbar-hint">
              Select text then click to format
            </span>
          </div>

          {/* ── CONTENTEDITABLE EDITOR ── */}
          <div
            ref={editorRef}
            className="wysiwyg-editor"
            contentEditable
            suppressContentEditableWarning
            onInput={handleEditorInput}
            onPaste={handleEditorPaste}
            data-placeholder="Write your thoughts, learnings, examples… Ctrl+V to paste images!"
          />
          <div className="char-count">{contentLength} characters</div>
        </div>

        {/* ── IMAGE UPLOAD ── */}
        <div className="form-group">
          <label>Images & GIFs</label>
          <div
            className={`image-drop-zone${dragOver ? " drag-over" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div className="upload-loading">
                <div className="upload-spinner" />
                <span>Uploading…</span>
              </div>
            ) : (
              <div className="drop-zone-hint">
                <span className="drop-icon">🖼️</span>
                <span>
                  Drag & drop,{" "}
                  <button
                    type="button"
                    className="upload-link"
                    onClick={() => fileInputRef.current.click()}
                  >
                    browse files
                  </button>
                  , or Ctrl+V in content area
                </span>
                <span className="drop-sub">
                  PNG, JPG, GIF, WebP — max 5MB each
                </span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {uploadError && <div className="upload-error">{uploadError}</div>}
        </div>

        {images.length > 0 && (
          <div className="image-previews">
            {images.map((img, i) => (
              <div key={i} className="image-preview-item">
                <img src={img.url} alt={img.name} className="preview-img" />
                {isGif(img.url) && <span className="gif-badge">GIF</span>}
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => removeImage(i)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            placeholder="e.g. selenium, regression, boundary testing"
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
          />
        </div>

        <div className="form-group">
          <div className="privacy-toggle">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={form.isPrivate}
                onChange={(e) => set("isPrivate", e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
            <span className="toggle-label">
              <strong>Private Entry</strong> — only visible to you (owner)
            </span>
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={uploading}
          >
            {uploading
              ? "Uploading…"
              : editingId
                ? "Update Entry"
                : "Save Entry"}
          </button>
        </div>
      </div>
    </div>
  );
}
