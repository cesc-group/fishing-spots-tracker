import { useState } from 'react'
import { useFishingData } from './useFishingData'
import CatchesView from './components/CatchesView'
import SpotsView from './components/SpotsView'
import './App.css'

const TABS = [
  { id: 'catches', label: 'Catches' },
  { id: 'list', label: 'Spots' },
  { id: 'map', label: 'Map' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'stats', label: 'Stats' },
  { id: 'guide', label: 'Guide' },
  { id: 'add', label: 'Add' },
]

function FishIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 22, height: 22 }}>
      <path d="M6.5 12c.5-3 2.5-7 8-7 4 0 6 2.5 6 4.5S18.5 14 14.5 14c-3 0-5-1-6.5-2" />
      <path d="M2 9c1.5 1.5 1.5 4.5 0 6" />
      <circle cx="17" cy="9.5" r=".6" fill="currentColor" />
    </svg>
  )
}

function TabIcon({ id }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8' }
  switch (id) {
    case 'catches':
      return <svg {...common}><path d="M6.5 12c.5-3 2.5-7 8-7 4 0 6 2.5 6 4.5S18.5 14 14.5 14c-3 0-5-1-6.5-2" /><path d="M2 9c1.5 1.5 1.5 4.5 0 6" /></svg>
    case 'list':
      return <svg {...common}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
    case 'map':
      return <svg {...common}><path d="M12 21s-7-7.2-7-12a7 7 0 1114 0c0 4.8-7 12-7 12z" /><circle cx="12" cy="9" r="2.3" /></svg>
    case 'timeline':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
    case 'stats':
      return <svg {...common}><path d="M4 20V10M12 20V4M20 20v-7" /></svg>
    case 'guide':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 8v.01M11 12h1v5h1" /></svg>
    case 'add':
      return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>
    default:
      return null
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('catches')
  const data = useFishingData()

  const favoriteCount = data.spots.filter((s) => s.favorite).length

  return (
    <div className="app">
      <h1 className="app-title">
        <FishIcon />
        Family <span className="accent">fishing</span>
      </h1>

      <div className="top-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="label" style={{ margin: '0 0 6px' }}>Total catches logged</p>
            <p style={{ fontSize: 26, fontWeight: 700, margin: 0, color: 'var(--lime)' }}>{data.catches.length}</p>
          </div>
          <div>
            <p className="label" style={{ margin: '0 0 6px' }}>Total spots</p>
            <p style={{ fontSize: 26, fontWeight: 700, margin: 0, color: 'var(--cyan)' }}>{data.spots.length}</p>
          </div>
          <div>
            <p className="label" style={{ margin: '0 0 6px' }}>Favorite spots</p>
            <p style={{ fontSize: 26, fontWeight: 700, margin: 0, color: 'var(--gold)' }}>{favoriteCount}</p>
          </div>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tabbtn${activeTab === t.id ? ' active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <TabIcon id={t.id} />
            {t.label}
          </button>
        ))}
      </div>

      {data.loading && <p className="muted">Loading...</p>}
      {data.error && <p className="tiny" style={{ color: 'var(--red)' }}>Error: {data.error}</p>}

      {!data.loading && activeTab === 'catches' && <CatchesView data={data} />}
      {!data.loading && activeTab === 'list' && <SpotsView data={data} />}
      {!data.loading && activeTab === 'map' && <p className="muted">Map tab — coming next.</p>}
      {!data.loading && activeTab === 'timeline' && <p className="muted">Timeline tab — coming next.</p>}
      {!data.loading && activeTab === 'stats' && <p className="muted">Stats tab — coming next.</p>}
      {!data.loading && activeTab === 'guide' && <p className="muted">Guide tab — coming next.</p>}
      {!data.loading && activeTab === 'add' && <p className="muted">Add tab — coming next.</p>}

      <p className="tiny footnote">Synced live across every device \u2014 powered by Supabase.</p>
    </div>
  )
}

export default App
