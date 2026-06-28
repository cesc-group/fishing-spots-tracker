import { useEffect, useMemo, useRef } from 'react'
import Chart from 'chart.js/auto'
import { isSaltSpecies, computePersonalBests } from '../constants'
import { barIsolateOnClick, legendIsolateOnClick } from '../chartHelpers'

const SIZE_PALETTE = ['#d4f24c', '#3fc1c9', '#f0615a', '#b78ef0', '#e0b35a', '#6bcf6b']
const LURE_PALETTE = ['#3fc1c9', '#f0615a', '#d4f24c', '#b78ef0', '#e0b35a', '#6bcf6b', '#5a9bd4', '#d46abf']
const MIN_POINTS_FOR_SIZE_CHART = 5
const MIN_CATCHES_FOR_LURE_CHART = 5

function MetricCard({ label, value, colorClass }) {
  return (
    <div className={`metric-card ${colorClass}`}>
      <p>{label}</p>
      <p>{value}</p>
    </div>
  )
}

export default function StatsView({ data }) {
  const { spots, catches } = data
  const speciesChartRef = useRef(null)
  const speciesChartInstance = useRef(null)
  const sizeChartRef = useRef(null)
  const sizeChartInstance = useRef(null)
  const lureChartRef = useRef(null)
  const lureChartInstance = useRef(null)

  const bySpecies = useMemo(() => {
    const map = {}
    catches.forEach((c) => {
      const k = c.species.toLowerCase().trim()
      map[k] = (map[k] || 0) + 1
    })
    return map
  }, [catches])

  const byAngler = useMemo(() => {
    const map = {}
    catches.forEach((c) => {
      const a = (c.angler || '').trim()
      if (a) map[a] = (map[a] || 0) + 1
    })
    return map
  }, [catches])

  const topSpecies = useMemo(() => {
    const keys = Object.keys(bySpecies).sort((a, b) => bySpecies[b] - bySpecies[a])
    return keys[0] || '\u2014'
  }, [bySpecies])

  const topAngler = useMemo(() => {
    const keys = Object.keys(byAngler).sort((a, b) => byAngler[b] - byAngler[a])
    return keys[0] || '\u2014'
  }, [byAngler])

  const bestSpot = useMemo(() => {
    const rated = spots.filter((s) => s.rating > 0)
    return rated.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0]
  }, [spots])

  const topSpots = useMemo(() => {
    const counts = {}
    catches.forEach((c) => { counts[c.spot_id] = (counts[c.spot_id] || 0) + 1 })
    return Object.keys(counts)
      .map((id) => {
        const s = spots.find((x) => x.id === id)
        return { name: s ? s.name : 'Unknown', count: counts[id] }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [catches, spots])

  const topAnglers = useMemo(
    () => Object.keys(byAngler).map((name) => ({ name, count: byAngler[name] })).sort((a, b) => b.count - a.count),
    [byAngler]
  )

  const pb = useMemo(() => computePersonalBests(catches), [catches])
  const pbRows = useMemo(() => {
    return Object.keys(pb.byKey)
      .map((k) => {
        const c = pb.byKey[k]
        return { angler: c.angler, species: c.species, size: c.size, date: c.catch_date }
      })
      .sort((a, b) => (a.angler || '').localeCompare(b.angler || '') || a.species.localeCompare(b.species))
  }, [pb])

  const sizedCatches = useMemo(
    () => catches.filter((c) => c.size && c.catch_date).slice().sort((a, b) => a.catch_date.localeCompare(b.catch_date)),
    [catches]
  )

  const luredCatches = useMemo(() => catches.filter((c) => c.lure), [catches])

  // Species chart
  useEffect(() => {
    if (!speciesChartRef.current) return
    if (speciesChartInstance.current) { speciesChartInstance.current.destroy(); speciesChartInstance.current = null }
    const labels = Object.keys(bySpecies)
    if (labels.length === 0) return
    const chartData = labels.map((k) => bySpecies[k])
    speciesChartInstance.current = new Chart(speciesChartRef.current, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Catches', data: chartData, backgroundColor: labels.map((l) => (isSaltSpecies(l) ? '#f0615a' : '#3fc1c9')) }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        onClick: (evt, elements, chart) => barIsolateOnClick(evt, elements, chart),
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1, color: '#8a8a85' }, grid: { color: '#1f1f1f' } },
          x: { ticks: { color: '#8a8a85' }, grid: { color: '#1f1f1f' } },
        },
      },
    })
    return () => { if (speciesChartInstance.current) { speciesChartInstance.current.destroy(); speciesChartInstance.current = null } }
  }, [bySpecies])

  // Size-over-time chart
  useEffect(() => {
    if (!sizeChartRef.current) return
    if (sizeChartInstance.current) { sizeChartInstance.current.destroy(); sizeChartInstance.current = null }
    if (sizedCatches.length < MIN_POINTS_FOR_SIZE_CHART) return

    const sizeLabels = sizedCatches.map((c) => {
      const d = new Date(c.catch_date + 'T00:00:00')
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    })
    const speciesKeys = []
    sizedCatches.forEach((c) => {
      const k = c.species.toLowerCase().trim()
      if (!speciesKeys.includes(k)) speciesKeys.push(k)
    })
    const datasets = speciesKeys.map((sp, i) => ({
      label: sp,
      data: sizedCatches.map((c) => (c.species.toLowerCase().trim() === sp ? c.size : null)),
      borderColor: SIZE_PALETTE[i % SIZE_PALETTE.length],
      backgroundColor: SIZE_PALETTE[i % SIZE_PALETTE.length],
      spanGaps: true,
      tension: 0.25,
      pointRadius: 4,
    }))

    sizeChartInstance.current = new Chart(sizeChartRef.current, {
      type: 'line',
      data: { labels: sizeLabels, datasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: speciesKeys.length > 1, labels: { color: '#8a8a85', font: { size: 11 } }, onClick: legendIsolateOnClick },
          tooltip: { enabled: false },
        },
        scales: {
          y: { ticks: { color: '#8a8a85' }, grid: { color: '#1f1f1f' }, title: { display: true, text: 'inches', color: '#8a8a85' } },
          x: { ticks: { color: '#8a8a85', maxRotation: 60 }, grid: { display: false } },
        },
      },
    })
    return () => { if (sizeChartInstance.current) { sizeChartInstance.current.destroy(); sizeChartInstance.current = null } }
  }, [sizedCatches])

  // Lure success chart
  useEffect(() => {
    if (!lureChartRef.current) return
    if (lureChartInstance.current) { lureChartInstance.current.destroy(); lureChartInstance.current = null }
    if (luredCatches.length < MIN_CATCHES_FOR_LURE_CHART) return

    const lureCounts = {}
    const allSpeciesSeen = []
    luredCatches.forEach((c) => {
      const lure = c.lure
      const sp = c.species.toLowerCase().trim()
      if (!lureCounts[lure]) lureCounts[lure] = {}
      lureCounts[lure][sp] = (lureCounts[lure][sp] || 0) + 1
      if (!allSpeciesSeen.includes(sp)) allSpeciesSeen.push(sp)
    })
    const lureNames = Object.keys(lureCounts).sort((a, b) => {
      let totalA = 0, totalB = 0
      Object.keys(lureCounts[a]).forEach((k) => { totalA += lureCounts[a][k] })
      Object.keys(lureCounts[b]).forEach((k) => { totalB += lureCounts[b][k] })
      return totalB - totalA
    })
    const lureDatasets = allSpeciesSeen.map((sp, i) => ({
      label: sp,
      data: lureNames.map((l) => lureCounts[l][sp] || 0),
      backgroundColor: LURE_PALETTE[i % LURE_PALETTE.length],
    }))

    lureChartInstance.current = new Chart(lureChartRef.current, {
      type: 'bar',
      data: { labels: lureNames, datasets: lureDatasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom', labels: { color: '#8a8a85', font: { size: 10 }, boxWidth: 10 }, onClick: legendIsolateOnClick },
          tooltip: { enabled: false },
        },
        scales: {
          x: { stacked: true, ticks: { color: '#8a8a85', maxRotation: 60 }, grid: { display: false } },
          y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1, color: '#8a8a85' }, grid: { color: '#1f1f1f' } },
        },
      },
    })
    return () => { if (lureChartInstance.current) { lureChartInstance.current.destroy(); lureChartInstance.current = null } }
  }, [luredCatches])

  return (
    <div>
      <div className="stats-grid">
        <MetricCard label="Total spots" value={spots.length} colorClass="c1" />
        <MetricCard label="Total catches" value={catches.length} colorClass="c2" />
        <MetricCard label="Top species" value={topSpecies} colorClass="c3" />
        <MetricCard label="Top angler" value={topAngler} colorClass="c4" />
        <MetricCard label="Best rated spot" value={bestSpot ? bestSpot.name : '\u2014'} colorClass="c5" />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <p className="muted" style={{ margin: '0 0 8px' }}>Catches by species</p>
        <div style={{ position: 'relative', width: '100%', height: 220 }}>
          <canvas ref={speciesChartRef} role="img" aria-label="Bar chart of catches per species" />
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <p className="muted" style={{ margin: '0 0 8px' }}>Top spots by catch count</p>
        {topSpots.length === 0 ? (
          <p className="tiny">Log some catches to see this.</p>
        ) : (
          topSpots.map((t) => (
            <div key={t.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '0.5px solid var(--border)' }}>
              <span>{t.name}</span>
              <span className="muted">{t.count} catches</span>
            </div>
          ))
        )}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <p className="muted" style={{ margin: '0 0 8px' }}>Catches by angler</p>
        {topAnglers.length === 0 ? (
          <p className="tiny">No angler logged on any catch yet \u2014 add one when logging a catch.</p>
        ) : (
          topAnglers.map((a, i) => (
            <div key={a.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '0.5px solid var(--border)' }}>
              <span>{a.name}{i === 0 ? ' \ud83e\udd47' : ''}</span>
              <span className="muted">{a.count} catches</span>
            </div>
          ))
        )}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <p className="muted" style={{ margin: '0 0 8px' }}>{'\ud83c\udfc6'} Personal bests</p>
        <p className="tiny" style={{ margin: '0 0 8px' }}>Biggest catch logged per angler, per species \u2014 needs a size entered to count.</p>
        {pbRows.length === 0 ? (
          <p className="tiny">No sized catches yet \u2014 add a size (in) when logging a catch to start tracking personal bests.</p>
        ) : (
          pbRows.map((r) => {
            const dateStr = r.date ? new Date(r.date + 'T00:00:00').toLocaleDateString() : ''
            return (
              <div key={r.angler + r.species} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, padding: '6px 0', borderBottom: '0.5px solid var(--border)' }}>
                <span>{r.angler} \u2014 {r.species}</span>
                <span className="muted">{r.size} in{dateStr ? ` \u00b7 ${dateStr}` : ''}</span>
              </div>
            )
          })
        )}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <p className="muted" style={{ margin: '0 0 8px' }}>Size over time</p>
        {sizedCatches.length < MIN_POINTS_FOR_SIZE_CHART ? (
          <p className="tiny">{sizedCatches.length} of {MIN_POINTS_FOR_SIZE_CHART} sized catches logged \u2014 the chart appears once there&rsquo;s enough to show a real trend, not just a couple of dots.</p>
        ) : (
          <div style={{ position: 'relative', width: '100%', height: 200 }}>
            <canvas ref={sizeChartRef} role="img" aria-label="Line chart of catch sizes over time" />
          </div>
        )}
      </div>

      <div>
        <p className="muted" style={{ margin: '0 0 8px' }}>What worked \u2014 lure success by species</p>
        {luredCatches.length < MIN_CATCHES_FOR_LURE_CHART ? (
          <p className="tiny">{luredCatches.length} of {MIN_CATCHES_FOR_LURE_CHART} catches logged with a lure \u2014 the chart appears once there&rsquo;s enough to show what&rsquo;s actually working.</p>
        ) : (
          <div style={{ position: 'relative', width: '100%', height: 240 }}>
            <canvas ref={lureChartRef} role="img" aria-label="Stacked bar chart of catches per lure, broken down by species" />
          </div>
        )}
      </div>
    </div>
  )
}
