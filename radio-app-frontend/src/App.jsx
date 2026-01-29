import { useState } from 'react'
import { NavButton } from './components/NavButton';
import { HomeView } from './views/HomeView';

function App() {
  const [currentView, setCurrentView] = useState("home")

  return (
    <div className="h-dvh flex flex-col bg-base-100 text-base-content overflow-hidden">
      {/* fixer Header */}
      <header className="h-14 flex items-center justify-center bg-base-200 shadow sticky top-0 z-20">
        <h1 className="text-lg font-semibold">Radio App</h1>
      </header>

      {/* scrollbarer Mittelteil, strikt begrenzt */}
      <main className="flex-1 overflow-y-auto px-4">
        {currentView === "home" && <HomeView/>}
        {currentView === "playlist" && <div>Playlist Screen (Platzhalter)</div>}
        {currentView === "wishes" && <div>Wünsche Screen (Platzhalter)</div>}
      </main>

      {/* fixe Bottom-Navigation */}
      <nav className="h-16 bg-base-200 border-t border-base-300 flex sticky bottom-0 z-20">
        <NavButton
          label="Home"
          active={currentView === "home"}
          onClick={() => setCurrentView("home")}
        />
        <NavButton
          label="Playlist"
          active={currentView === "playlist"}
          onClick={() => setCurrentView("playlist")}
        />
        <NavButton
          label="Wünsche"
          active={currentView === "wishes"}
          onClick={() => setCurrentView("wishes")}
        />
      </nav>
    </div>
  )
}

export default App
