import React from "react";

export function renderContent(text) {
  if (!text) return null;

  return text.split("\n").map((line, lineIdx) => (
    <React.Fragment key={lineIdx}>
      {lineIdx > 0 && <br />}
      {parseLine(line)}
    </React.Fragment>
  ));
}

function parseLine(line) {
  const pattern = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  const parts = [];
  let lastIdx = 0;
  let match;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > lastIdx) parts.push(line.slice(lastIdx, match.index));

    const full = match[0];
    if (full.startsWith("**"))
      parts.push(<strong key={match.index}>{match[2]}</strong>);
    else if (full.startsWith("*"))
      parts.push(<em key={match.index}>{match[3]}</em>);
    else if (full.startsWith("`"))
      parts.push(<code key={match.index}>{match[4]}</code>);

    lastIdx = match.index + full.length;
  }

  if (lastIdx < line.length) parts.push(line.slice(lastIdx));
  return parts.length > 0 ? parts : line;
}
