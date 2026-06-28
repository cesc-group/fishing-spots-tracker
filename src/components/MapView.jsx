function PinIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" fill={color} stroke="none" style={{ width: 22, height: 22, flexShrink: 0 }}>
      <path d="M12 21s-7-7.2-7-12a7 7 0 1114 0c0 4.8-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.3" fill="var(--bg-card)" />
    </svg>
  )
}

function MapSpotCard({ spot }) {
  return (
    <div className={`card${spot.favorite ? ' is-favorite' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <PinIcon color={spot.maplink ? (spot.favorite ? 'var(--gold)' : 'var(--red)') : 'var(--text-tertiary)'} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>{spot.name}</p>
        <p className="tiny" style={{ margin: '2px 0 0' }}>{(spot.species || []).join(', ')}</p>
      </div>
      {spot.maplink ? (
        <a href={spot.maplink} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, fontSize: 13 }}>
          Open in Maps
        </a>
      ) : (
        <span className="tiny" style={{ flexShrink: 0 }}>No map link</span>
      )}
    </div>
  )
}

export default function MapView({ data }) {
  const { spots } = data
  const withLink = spots.filter((s) => s.maplink)
  const withoutLink = spots.filter((s) => !s.maplink)

  return (
    <div>
      <p className="muted" style={{ margin: '0 0 12px' }}>
        Tap "Open in Maps" to view a spot's location in Google Maps.
      </p>
      {withLink.length === 0 && withoutLink.length === 0 ? (
        <p className="empty-state">No spots yet.</p>
      ) : (
        <>
          {withLink.map((spot) => <MapSpotCard key={spot.id} spot={spot} />)}
          {withoutLink.length > 0 && (
            <>
              <p className="tiny" style={{ margin: '12px 0 8px' }}>Spots without a map link saved:</p>
              {withoutLink.map((spot) => <MapSpotCard key={spot.id} spot={spot} />)}
            </>
          )}
        </>
      )}
    </div>
  )
}
