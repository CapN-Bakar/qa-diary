# QA Journal — Software Testing Diary

Built with React + Vite + Supabase.

---

## 🚀 Local Development

```
npm install
npm run dev
```

Runs at http://localhost:5173

---

## 🔑 Owner Login
Click **Owner Login** in the header and enter both PINs in sequence.

---

## ☁️ Supabase Setup

### Create the entries table
Run this in Supabase SQL Editor:

```sql
create table entries (
  id text primary key,
  date text not null,
  category text not null,
  title text not null,
  content text not null,
  tags text[] default '{}',
  is_private boolean default false,
  created_at timestamp with time zone default now()
);

alter table entries enable row level security;

create policy "Public entries are viewable by everyone"
on entries for select
using (is_private = false);

create policy "All entries viewable with service role"
on entries for all
using (true);
```

### Environment Variables
Create a `.env.local` file in the project root:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Vercel Environment Variables
In Vercel dashboard → Settings → Environment Variables, add:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 🔐 Changing PINs
Generate new hashes:
```
node -e "const c=require('crypto'); console.log(c.createHash('sha256').update('NEWPIN').digest('hex'))"
```
Replace the hash constants in `src/context/JournalContext.jsx` and redeploy.
