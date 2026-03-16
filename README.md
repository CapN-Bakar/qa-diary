# QA Journal — Software Testing Diary

A personal diary app built with **React + Vite** for documenting your Software Testing course learnings.

---

## 🚀 Quick Start

### Step 1 — Install Node.js (if you haven't yet)
Download the **LTS** version from https://nodejs.org and run the installer.

### Step 2 — Extract and open in VS Code
Unzip the folder, then in VS Code: `File → Open Folder → qa-diary`

### Step 3 — Open the terminal
Press `` Ctrl + ` `` to open the VS Code integrated terminal.

### Step 4 — Install dependencies
```
npm install
```
Only needed once. With Vite this installs ~80 packages (vs 1,300 with CRA).

### Step 5 — Run the app
```
npm run dev
```
Opens at **http://localhost:5173** — hot reloads instantly on every file save.

---

## 👤 Owner vs Visitor Mode

| Feature                        | Visitor | Owner (unlocked) |
|-------------------------------|---------|-----------------|
| Read public entries            | ✅      | ✅              |
| Read private entries           | ❌      | ✅              |
| Add / Edit / Delete entries    | ❌      | ✅              |
| "All Entries" view             | ❌      | ✅              |
| "New Entry" button visible     | ❌      | ✅              |

### First-time login
1. Click **🔑 Owner Login** in the top-right header
2. You will be prompted to **set two 4-digit PINs** (first time only)
3. Both PINs are required every time you log in — in sequence

### Logging out
Click **🔓 Owner Mode** to lock and return to visitor view.

### Changing your PINs
While logged in, open any entry → click **🔑 Change PINs** in the actions bar.

---

## 📁 Project Structure

```
qa-diary/
├── index.html                      ← HTML shell (Vite convention — at root)
├── vite.config.js                  ← Vite configuration
├── package.json
├── src/
│   ├── main.jsx                    ← React entry point
│   ├── App.jsx                     ← Root component
│   ├── App.css                     ← Layout + shared styles
│   ├── index.css                   ← CSS variables + global reset
│   ├── context/
│   │   └── JournalContext.jsx      ← Global state + dual-PIN auth
│   ├── data/
│   │   └── sampleData.js           ← Sample entries + quotes
│   ├── utils/
│   │   └── helpers.js              ← uid, formatDate, getCatClass
│   └── components/
│       ├── Header/
│       │   ├── Header.jsx          ← Nav + Owner Login button
│       │   └── Header.css
│       ├── Sidebar/
│       │   ├── SidebarLeft.jsx     ← Category filter + topic cloud
│       │   ├── SidebarRight.jsx    ← Stats + this week
│       │   └── Sidebar.css
│       ├── Feed/
│       │   ├── Feed.jsx            ← Entry list + search
│       │   └── Feed.css
│       ├── EntryCard/
│       │   ├── EntryCard.jsx       ← Individual entry card
│       │   └── EntryCard.css
│       ├── EntryDetail/
│       │   ├── EntryDetail.jsx     ← Full entry view
│       │   └── EntryDetail.css
│       ├── Practices/
│       │   ├── Practices.jsx       ← Good Practices board
│       │   └── Practices.css
│       └── Modals/
│           ├── PinRow.jsx          ← Reusable PIN input row
│           ├── LoginModal.jsx      ← Dual-PIN owner login
│           ├── AddEntryModal.jsx   ← Add / edit entry form
│           ├── ChangePinsModal.jsx ← Change both PINs
│           └── Modal.css
```

---

## 💾 Data Storage
All entries and PINs are saved in **localStorage** — no server needed.
Your data persists between browser sessions automatically.

---

## 🛠 Tech Stack
- **React 18** + **Vite 5** — fast dev server, instant hot reload
- **React Context API** — global state, no Redux
- **Plain CSS** — one `.css` per component, CSS variables for theming
- **localStorage** — browser-native persistence
- **Google Fonts** — Crimson Pro + DM Sans + DM Mono
