import { useEffect, useMemo, useRef } from 'react'
import Chart from 'chart.js/auto'
import { isSaltSpecies, computePersonalBests } from '../constants'

function applyOpacity(color, alpha) {
  if (typeof color !== 'string' || color.charAt(0) !== '#') return color
  let hex = color.slice(1)
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function barIsolateOnClick(evt, elements, chart) {
  if (!elements || elements.length === 0) return
  const clickedIndex = elements[0].index
  const ds = chart.data.datasets[0]
  if (!ds._fullColors) {
    ds._fullColors = Array.isArray(ds.backgroundColor) ? ds.backgroundColor.slice() : ds.data.map(() => ds.backgroundColor)
  }
  const isCurrentlyIsolated = chart.$_isolatedBar === clickedIndex
  ds.backgroundColor = ds._fullColors.map((color, i) => {
    const target = isCurrentlyIsolated ? 1 : (i === clickedIndex ? 1 : 0.15)
    return applyOpacity(color, target)
  })
  chart.$_isolatedBar = isCurrentlyIsolated ? null : clickedIndex
  chart.update()
}

export default function TimelineView({ data }) {
  const { catches, spots } = data
  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null)

  const withDates = useMemo(
    () => catches.filter((c) => c.catch_date).slice().sort((a, b) => a.catch_date.localeCompare(b.catch_date)),
    [catches]
  )

  const pb = useMemo(() => computePersonalBests(catches), [catches])

  useEffect(() => {
    if (!chartRef.current) return
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
      chartInstanceRef.current = null
    }
    if (withDates.length === 0) return

    const byDay = {}
    withDates.forEach((c) => { byDay[c.catch_date] = (byDay[c.catch_date] || 0) + 1 })
    const dayKeys = Object.keys(byDay).sort()
    const dayLabels = dayKeys.map((k) => {
      const d = new Date(k + 'T00:00:00')
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    })
    const dayCounts = dayKeys.map((k) => byDay[k])

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'bar',
      data: { labels: dayLabels, datasets: [{ label: 'Catches', data: dayCounts, backgroundColor: '#d4f24c', borderRadius: 3 }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        onClick: (evt, elements, chart) => barIsolateOnClick(evt, elements, chart),
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1, color: '#8a8a85' }, grid: { color: '#1f1f1f' } },
          x: { ticks: { color: '#8a8a85', maxRotation: 60, minRotation: 0, autoSkip: true }, grid: { display: false } },
        },
      },
    })

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      }
    }
  }, [withDates])

  let lastMonth = ''

  return (
    <div>
      <p className="muted" style={{ margin: '0 0 8px' }}>Catches per day</p>
      <div style={{ position: 'relative', width: '100%', height: 180, marginBottom: '1.4rem' }}>
        <canvas ref={chartRef} role="img" aria-label="Bar chart of catches per day over time" />
      </div>

      <p className="muted" style={{ margin: '0 0 12px' }}>Every catch, oldest to newest.</p>

      {withDates.length === 0 ? (
        <p className="empty-state">No catches logged yet — once you log a few, they&rsquo;ll line up here by date.</p>
      ) : (
        withDates.map((c) => {
          const d = new Date(c.catch_date + 'T00:00:00')
          const monthLabel = d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
          const showMonth = monthLabel !== lastMonth
          lastMonth = monthLabel
          const spot = spots.find((s) => s.id === c.spot_id)
          const dayLabel = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          const dotClass = isSaltSpecies(c.species) ? 'tl-dot salt' : 'tl-dot'
          const isPB = !!pb.ids[c.id]

          return (
            <div key={c.id}>
              {showMonth && <p className="tl-month">{monthLabel}</p>}
              <div className="tl-item">
                <span className={dotClass} />
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="tiny" style={{ margin: '0 0 2px' }}>{dayLabel}</p>
                    <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>
                      {c.species}{c.size ? ` \u00b7 ${c.size} in` : ''}
                      {isPB && <span title="Personal best" style={{ color: 'var(--gold)', marginLeft: 6 }}>{'\ud83c\udfc6'}</span>}
                    </p>
                    <p className="tiny" style={{ margin: '2px 0 0' }}>
                      {spot ? spot.name : 'Unknown spot'}{c.angler ? ` \u00b7 ${c.angler}` : ''}{c.lure ? ` \u00b7 ${c.lure}` : ''}
                    </p>
                  </div>
                  {c.photo_url && (
                    <img
                      src={c.photo_url}
                      alt="Catch"
                      onClick={() => window.open(c.photo_url, '_blank')}
                      style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', cursor: 'pointer', flexShrink: 0, marginTop: 4 }}
                    />
                  )}
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
