import React, { useMemo, useState, useEffect } from "react";
import { useJournal } from "../../context/JournalContext";
import { formatDate } from "../../utils/helpers";
import { trackVisit, getVisitorCount } from "../../lib/analytics";
import "./Sidebar.css";

export default function SidebarRight() {
  const { entries, unlocked, navigateTo } = useJournal();
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    async function init() {
      await trackVisit();
      const count = await getVisitorCount();
      setVisitorCount(count);
    }
    init();
  }, []);

  const stats = useMemo(
    () => ({
      total: entries.length,
      pub: entries.filter((e) => !e.isPrivate).length,
      priv: entries.filter((e) => e.isPrivate).length,
      days: new Set(entries.map((e) => e.date)).size,
    }),
    [entries],
  );

  const weekEntries = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    return entries
      .filter((e) => new Date(e.date + "T00:00:00") >= cutoff)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4);
  }, [entries]);

  const STATS = [
    { num: stats.total, label: "Total Entries" },
    { num: stats.pub, label: "Public" },
    { num: stats.priv, label: "Private" },
    { num: stats.days, label: "Days Tracked" },
    { num: visitorCount !== null ? visitorCount : "…", label: "Visitors" },
  ];

  return (
    <aside className="sidebar-right">
      <div className="sidebar-section">
        <div className="sidebar-label">Stats</div>
        {STATS.map(({ num, label }) => (
          <div
            className={`stat-card${label === "Visitors" ? " stat-card-visitors" : ""}`}
            key={label}
          >
            <div className="stat-num">{num}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">This Week</div>
        {weekEntries.length === 0 ? (
          <p className="no-week">No entries this week yet.</p>
        ) : (
          <div className="week-list">
            {weekEntries.map((e) => (
              <div
                key={e.id}
                className="week-item"
                onClick={() => {
                  if (!e.isPrivate || unlocked) navigateTo("detail", e.id);
                }}
              >
                <span className="week-title">
                  {e.isPrivate && !unlocked
                    ? "🔒 Private entry"
                    : e.title.slice(0, 28) + (e.title.length > 28 ? "…" : "")}
                </span>
                <span className="week-date">{formatDate(e.date)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
