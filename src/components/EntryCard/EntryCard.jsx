import React from "react";
import { useJournal } from "../../context/JournalContext";
import { formatDate, getCatClass } from "../../utils/helpers";
import "./EntryCard.css";

function stripHTML(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export default function EntryCard({ entry }) {
  const { navigateTo, unlocked } = useJournal();

  return (
    <div
      className={[
        "entry-card",
        entry.isPrivate ? "private-card" : "",
        entry.category === "Good Practice" ? "practice-card" : "",
      ]
        .join(" ")
        .trim()}
      onClick={() => navigateTo("detail", entry.id)}
    >
      <div className="entry-meta">
        <span className="entry-date">{formatDate(entry.date)}</span>
        <span className={`entry-category ${getCatClass(entry.category)}`}>
          {entry.category}
        </span>
        {entry.isPrivate && unlocked && (
          <span className="entry-privacy-badge">🔒 Private</span>
        )}
      </div>
      <div className="entry-title">{entry.title}</div>
      <div className="entry-body">{stripHTML(entry.content)}</div>
      {entry.tags.length > 0 && (
        <div className="entry-tags">
          {entry.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
