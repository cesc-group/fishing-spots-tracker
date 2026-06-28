export const SPECIES_LIST = [
  'Snook', 'Tarpon', 'Redfish', 'Spotted seatrout', 'Mangrove snapper', 'Jack crevalle',
  'Largemouth bass', 'Peacock bass', 'Bluegill', 'Snakehead', 'Tilapia', 'Carp',
  'Sunshine bass', 'Black crappie', 'Channel catfish', 'Gar', 'Mayan cichlid', 'Oscar',
]

export const LURE_LIST = [
  'Live shrimp', 'Live pinfish', 'Live crab', 'Live threadfin', 'Live shiner',
  'Topwater frog', 'Soft swimbait', 'Jerkbait', 'Jig', 'Spinnerbait',
  'Texas-rigged worm', 'Twitchbait (MirrOlure)', 'Small jig under bobber',
  'Cricket', 'Bread ball', 'Corn', 'Dough bait', 'Cut bait', 'Popping cork rig',
]

export const KNOWN_ANGLERS = ['Pap\u00e1', 'Domingo', 'Renato', 'Mam\u00e1']

const SALT_SPECIES = ['snook', 'tarpon', 'redfish', 'seatrout', 'snapper', 'jack crevalle']

export function isSaltSpecies(name) {
  const n = (name || '').toLowerCase()
  return SALT_SPECIES.some((k) => n.indexOf(k) !== -1)
}

export const FWC_LINKS = {
  snook: { url: 'https://myfwc.com/fishing/saltwater/recreational/snook/', label: 'FWC snook regs' },
  tarpon: { url: 'https://myfwc.com/fishing/saltwater/recreational/tarpon/', label: 'FWC tarpon regs' },
  redfish: { url: 'https://myfwc.com/fishing/saltwater/recreational/', label: 'FWC saltwater regs (redfish)' },
  seatrout: { url: 'https://myfwc.com/fishing/saltwater/recreational/', label: 'FWC saltwater regs (seatrout)' },
  snapper: { url: 'https://myfwc.com/fishing/saltwater/recreational/', label: 'FWC saltwater regs (snapper)' },
  'jack crevalle': { url: 'https://myfwc.com/fishing/saltwater/recreational/', label: 'FWC saltwater regs' },
  bass: { url: 'https://myfwc.com/fishing/freshwater/regulations/', label: 'FWC freshwater regs' },
  'peacock bass': { url: 'https://myfwc.com/fishing/freshwater/regulations/', label: 'FWC freshwater regs' },
  bluegill: { url: 'https://myfwc.com/fishing/freshwater/regulations/', label: 'FWC freshwater regs' },
  tilapia: { url: 'https://myfwc.com/fishing/freshwater/regulations/', label: 'FWC freshwater regs' },
  carp: { url: 'https://myfwc.com/fishing/freshwater/regulations/', label: 'FWC freshwater regs' },
  crappie: { url: 'https://myfwc.com/fishing/freshwater/regulations/', label: 'FWC freshwater regs' },
  catfish: { url: 'https://myfwc.com/fishing/freshwater/regulations/', label: 'FWC freshwater regs' },
  gar: { url: 'https://myfwc.com/fishing/freshwater/regulations/', label: 'FWC freshwater regs' },
  cichlid: { url: 'https://myfwc.com/fishing/freshwater/regulations/', label: 'FWC freshwater regs (invasive species)' },
  oscar: { url: 'https://myfwc.com/fishing/freshwater/regulations/', label: 'FWC freshwater regs (invasive species)' },
  snakehead: { url: 'https://myfwc.com/fishing/freshwater/regulations/', label: 'FWC freshwater regs (invasive species, no limit)' },
}

export function regForSpecies(name) {
  const key = (name || '').toLowerCase().trim()
  for (const k of Object.keys(FWC_LINKS)) {
    if (key.indexOf(k) !== -1) return FWC_LINKS[k]
  }
  return null
}

export const BAIT_GUIDE = [
  { species: 'snook', lures: 'Live pinfish or shrimp on a jighead; swimbaits and twitchbaits (e.g. MirrOlure) around structure and mangrove edges.', timing: 'Dawn, dusk, and moving tide outfish dead tide.', water: 'saltwater (regulated even in tidal canals)' },
  { species: 'tarpon', lures: 'Live crabs, threadfin, or large soft swimbaits. Heavy leader and stout tackle for the runs.', timing: 'Warm months, moving water, early morning before boat traffic.', water: 'saltwater, tag required to harvest' },
  { species: 'redfish', lures: 'Live shrimp or cut bait on a popping cork rig; gold spoons near grass flats.', timing: 'Moving tide, especially the first hour of an incoming tide.', water: 'saltwater' },
  { species: 'spotted seatrout', lures: 'Live shrimp under a popping cork; soft jerkbaits over grass flats.', timing: 'Early morning, moving water over seagrass.', water: 'saltwater' },
  { species: 'mangrove snapper', lures: 'Live shrimp or small cut bait fished tight to mangrove roots and docks.', timing: 'Dusk and night bites are strong around structure.', water: 'saltwater' },
  { species: 'jack crevalle', lures: 'Topwater plugs and fast-retrieved swimbaits; they chase aggressively.', timing: 'Moving tide near passes and inlets.', water: 'saltwater' },
  { species: 'largemouth bass', lures: 'Texas-rigged worms, spinnerbaits, topwater frogs near cover; live shiners when bite is slow.', timing: 'Early morning and late afternoon, especially around vegetation.', water: 'freshwater' },
  { species: 'peacock bass', lures: 'Small jerkbaits, jigs, and live shiners. Aggressive strikes on bright colors.', timing: 'Warm, sunny days; they go quiet in cold fronts.', water: 'freshwater, south FL canals' },
  { species: 'bluegill', lures: 'Small worms, crickets, or tiny jigs under a bobber near docks and grass lines.', timing: 'Mornings, spawning beds in spring.', water: 'freshwater' },
  { species: 'snakehead', lures: 'Topwater frogs, swimbaits, and live bait near grass and lily pads. Aggressive, will strike hard.', timing: 'Warm weather, shallow vegetated water.', water: 'freshwater, invasive \u2014 encourage harvest, no closed season or size limit' },
  { species: 'tilapia', lures: 'Bread balls, small jigs, or worms near structure; can be finicky and spook easily.', timing: 'Warm, calm days near shallow flats.', water: 'freshwater' },
  { species: 'carp', lures: 'Corn, dough bait, or bottom-fished worms on light tackle.', timing: 'Calm mornings and overcast days.', water: 'freshwater' },
  { species: 'sunshine bass', lures: 'Bucktail jigs and live shiners worked near deeper structure.', timing: 'Cooler months, early morning.', water: 'freshwater, stocked hybrid' },
  { species: 'black crappie', lures: 'Small jigs or live minnows around brush piles and docks.', timing: 'Cooler months, low light.', water: 'freshwater' },
  { species: 'channel catfish', lures: 'Cut bait or dough bait fished on bottom.', timing: 'Evening through night.', water: 'freshwater' },
  { species: 'gar', lures: 'Rope lures or live bait, slow presentation \u2014 they have a tough bony mouth.', timing: 'Warm, calm days near the surface.', water: 'freshwater' },
  { species: 'mayan cichlid', lures: 'Small jigs or worms near structure.', timing: 'Warm days, south FL canals.', water: 'freshwater, invasive' },
  { species: 'oscar', lures: 'Small jigs, worms, or pellets near structure.', timing: 'Warm, calm days.', water: 'freshwater, invasive' },
]

export function compressImage(file, maxDim = 1000, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let w = img.width
        let h = img.height
        if (w > h && w > maxDim) { h = Math.round(h * (maxDim / w)); w = maxDim }
        else if (h > maxDim) { w = Math.round(w * (maxDim / h)); h = maxDim }
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality)
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function computePersonalBests(catches) {
  const byKey = {}
  catches.forEach((c) => {
    if (!c.size || !c.angler) return
    const key = c.angler.toLowerCase() + '|' + c.species.toLowerCase().trim()
    if (!byKey[key] || c.size > byKey[key].size) byKey[key] = c
  })
  const ids = {}
  Object.keys(byKey).forEach((k) => { ids[byKey[k].id] = true })
  return { byKey, ids }
}
