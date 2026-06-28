import { useMemo } from 'react'

function extractCoords(url) {
  if (!url) return null
  let m = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) }
  m = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) }
  return null
}

function PinIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" fill={color} stroke="none" style={{ width: 26, height: 26 }}>
      <path d="M12 21s-7-7.2-7-12a7 7 0 1114 0c0 4.8-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.3" fill="var(--bg-card)" />
    </svg>
  )
}

function SpotMiniCard({ spot }) {
  return (
    <div className="card" style={{ padding: '0.75rem 1rem' }}>
      <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{spot.name}</p>
      <p className="tiny" style={{ margin: '4px 0 0' }}>{(spot.species || []).join(', ')}</p>
    </div>
  )
}

export default function MapView({ data }) {
  const { spots } = data

  const { withCoords, withoutCoords, bounds } = useMemo(() => {
    const withC = []
    const withoutC = []
    const lats = []
    const lngs = []
    spots.forEach((s) => {
      const c = extractCoords(s.maplink)
      if (c) {
        withC.push({ spot: s, coords: c })
        lats.push(c.lat)
        lngs.push(c.lng)
      } else {
        withoutC.push(s)
      }
    })
    if (lats.length === 0) return { withCoords: withC, withoutCoords: withoutC, bounds: null }
    let minLat = Math.min(...lats)
    let maxLat = Math.max(...lats)
    let minLng = Math.min(...lngs)
    let maxLng = Math.max(...lngs)
    const padLat = Math.max((maxLat - minLat) * 0.15, 0.01)
    const padLng = Math.max((maxLng - minLng) * 0.15, 0.01)
    minLat -= padLat
    maxLat += padLat
    minLng -= padLng
    maxLng += padLng
    return { withCoords: withC, withoutCoords: withoutC, bounds: { minLat, maxLat, minLng, maxLng } }
  }, [spots])

  return (
    <div>
      <div className="top-panel" style={{ marginBottom: 12 }}>
        <p className="muted" style={{ margin: '0 0 8px' }}>
          Tap a pin to open it in Google Maps. Spots need a saved map link to appear here.
        </p>
        <div style={{ position: 'relative', width: '100%', height: 320, background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {withCoords.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 16, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
              No spots have a Google Maps link yet.
            </div>
          ) : (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {withCoords.map(({ spot, coords }) => {
                const x = ((coords.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100
                const y = (1 - (coords.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100
                return (
                  <button
                    key={spot.id}
                    onClick={() => window.open(spot.maplink, '_blank', 'noopener,noreferrer')}
                    title={spot.name}
                    style={{
                      position: 'absolute',
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -100%)',
                      cursor: 'pointer',
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                    }}
                  >
                    <PinIcon color={spot.favorite ? 'var(--gold)' : 'var(--red)'} />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {withoutCoords.length > 0 && (
        <div>
          <p className="tiny" style={{ margin: '4px 0 8px' }}>Spots without map coordinates:</p>
          {withoutCoords.map((spot) => <SpotMiniCard key={spot.id} spot={spot} />)}
        </div>
      )}
    </div>
  )
}
