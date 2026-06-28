// Shared Chart.js interaction helpers, used by TimelineView, StatsView, etc.
// Clicking a bar or legend item isolates it (full opacity) and dims the rest.
// Clicking the same one again restores everyone to full opacity.

export function applyOpacity(color, alpha) {
  if (typeof color !== 'string' || color.charAt(0) !== '#') return color
  let hex = color.slice(1)
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export function barIsolateOnClick(evt, elements, chart) {
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

export function legendIsolateOnClick(e, legendItem, legend) {
  const chart = legend.chart
  const clickedIndex = legendItem.datasetIndex
  const isCurrentlyIsolated = chart.$_isolatedIndex === clickedIndex
  chart.data.datasets.forEach((ds, i) => {
    if (!ds._fullColor) ds._fullColor = ds.borderColor || ds.backgroundColor
    const target = isCurrentlyIsolated ? 1 : (i === clickedIndex ? 1 : 0.15)
    if (ds.borderColor) ds.borderColor = applyOpacity(ds._fullColor, target)
    if (ds.backgroundColor && !Array.isArray(ds.backgroundColor)) ds.backgroundColor = applyOpacity(ds._fullColor, target)
  })
  chart.$_isolatedIndex = isCurrentlyIsolated ? null : clickedIndex
  chart.update()
}
