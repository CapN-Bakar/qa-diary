import React from 'react'
import { JournalProvider, useJournal } from './context/JournalContext'
import Header from './components/Header/Header'
import SidebarLeft from './components/Sidebar/SidebarLeft'
import SidebarRight from './components/Sidebar/SidebarRight'
import Feed from './components/Feed/Feed'
import Practices from './components/Practices/Practices'
import EntryDetail from './components/EntryDetail/EntryDetail'
import AddEntryModal from './components/Modals/AddEntryModal'
import LoginModal from './components/Modals/LoginModal'
import './App.css'

function AppInner() {
  const { currentView, showAddModal, showLoginModal } = useJournal()

  return (
    <div className="app">
      <Header />
      <div className="layout">
        <SidebarLeft />
        <main className="main">
          {currentView === 'feed'      && <Feed />}
          {currentView === 'all'       && <Feed showAll />}
          {currentView === 'practices' && <Practices />}
          {currentView === 'detail'    && <EntryDetail />}
        </main>
        <SidebarRight />
      </div>

      {showAddModal   && <AddEntryModal />}
      {showLoginModal && <LoginModal />}
    </div>
  )
}

export default function App() {
  return (
    <JournalProvider>
      <AppInner />
    </JournalProvider>
  )
}
