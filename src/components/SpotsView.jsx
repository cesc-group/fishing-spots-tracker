import { useState, useMemo } from 'react'
import { SPECIES_LIST, isSaltSpecies } from '../constants'

const EMPTY_FORM = { name: '', speciesChecked: [], speciesOther: '', maplink: '', tags: '', notes: '', rating: 0, favorite: false }

function StarRow({ rating, interactive, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
          onClick={interactive ? () => onChange(n) : undefined}
          style={{
            width: 18, height: 18,
            cursor: interactive ? 'pointer' : 'default',
            color: n <= rating ? 'var(--gold)' : 'var(--border)',
          }}
        >
          <path d="M12 3l2.7 6.1 6.6.6-5 4.5 1.5 6.5L12 17.3 6.2 20.7l1.5-6.5-5-4.5 6.6-.6L12 3z" />
        </svg>
      ))}
    </div>
  )
}

function StarIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" style={{ width: 18, height: 18, color: filled ? 'var(--gold)' : 'var(--text-secondary)' }}>
      <path d="M12 3l2.7 6.1 6.6.6-5 4.5 1.5 6.5L12 17.3 6.2 20.7l1.5-6.5-5-4.5 6.6-.6L12 3z" />
    </svg>
  )
}

function EditIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 15, height: 15 }}><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
}
function TrashIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 15, height: 15 }}><path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0l-1 14a1 1 0 01-1 1H8a1 1 0 01-1-1L6 6" /></svg>
}
function MapPinIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 16, height: 16 }}><path d="M12 21s-7-7.2-7-12a7 7 0 1114 0c0 4.8-7 12-7 12z" /><circle cx="12" cy="9" r="2.3" /></svg>
}

function SpotCard({ spot, catchCount, onEdit, onDelete }) {
  return (
    <div className={`card${spot.favorite ? ' is-favorite' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {spot.favorite && <StarIcon filled />}
            <p style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>{spot.name}</p>
          </div>
          <div style={{ margin: '4px 0 6px' }}>
            <StarRow rating={spot.rating || 0} interactive={false} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button className="icon-btn" aria-label="Edit spot" onClick={() => onEdit(spot)}><EditIcon /></button>
          <button className="icon-btn" aria-label="Delete spot" onClick={() => onDelete(spot.id)}><TrashIcon /></button>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '6px 0' }}>
        {(spot.species || []).map((s) => (
          <span key={s} className={`badge${isSaltSpecies(s) ? ' salt' : ''}`}>{s}</span>
        ))}
      </div>
      {spot.tags && spot.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
          {spot.tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
      )}
      {spot.notes && <p className="muted" style={{ margin: '6px 0 0' }}>{spot.notes}</p>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        {spot.maplink ? (
          <a href={spot.maplink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <MapPinIcon /> Open in maps
          </a>
        ) : (
          <span className="tiny">No map link saved</span>
        )}
        <span className="tiny">{catchCount} logged</span>
      </div>
    </div>
  )
}

export default function SpotsView({ data }) {
  const { spots, catches, addSpot, updateSpot, deleteSpot } = data
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('favorites')
  const [saving, setSaving] = useState(false)

  const catchCountBySpot = useMemo(() => {
    const map = {}
    catches.forEach((c) => { map[c.spot_id] = (map[c.spot_id] || 0) + 1 })
    return map
  }, [catches])

  const filteredSorted = useMemo(() => {
    const q = search.toLowerCase().trim()
    let list = spots.filter((s) => {
      if (!q) return true
      const hay = (s.name + ' ' + (s.species || []).join(' ') + ' ' + (s.tags || []).join(' ')).toLowerCase()
      return hay.includes(q)
    })
    list = [...list]
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    else if (sortBy === 'recent') list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    else if (sortBy === 'favorites') list.sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) || (b.rating || 0) - (a.rating || 0))
    return list
  }, [spots, search, sortBy])

  function openAddForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  function openEditForm(spot) {
    setEditingId(spot.id)
    const checked = (spot.species || []).filter((s) => SPECIES_LIST.some((c) => c.toLowerCase() === s.toLowerCase()))
    const other = (spot.species || []).filter((s) => !SPECIES_LIST.some((c) => c.toLowerCase() === s.toLowerCase()))
    setForm({
      name: spot.name,
      speciesChecked: checked,
      speciesOther: other.join(', '),
      maplink: spot.maplink || '',
      tags: (spot.tags || []).join(', '),
      notes: spot.notes || '',
      rating: spot.rating || 0,
      favorite: !!spot.favorite,
    })
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  function toggleSpecies(sp) {
    setForm((f) => ({
      ...f,
      speciesChecked: f.speciesChecked.includes(sp)
        ? f.speciesChecked.filter((s) => s !== sp)
        : [...f.speciesChecked, sp],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const otherSpecies = form.speciesOther.split(',').map((s) => s.trim()).filter(Boolean)
    const species = [...form.speciesChecked, ...otherSpecies]
    if (!form.name.trim() || species.length === 0) {
      alert('Give the spot a name and check at least one species (or add one under "Other").')
      return
    }
    const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean)
    const payload = {
      name: form.name.trim(),
      species,
      maplink: form.maplink.trim(),
      notes: form.notes.trim(),
      rating: form.rating,
      favorite: form.favorite,
      tags,
    }
    setSaving(true)
    try {
      if (editingId) await updateSpot(editingId, payload)
      else await addSpot(payload)
      closeForm()
    } catch (err) {
      alert('Could not save that spot: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this spot? Catches logged at this spot will keep their record but show "Unknown spot".')) return
    try {
      await deleteSpot(id)
    } catch (err) {
      alert('Could not delete that spot: ' + err.message)
    }
  }

  return (
    <div>
      {!showForm && (
        <>
          <div className="row" style={{ marginBottom: 16 }}>
            <input
              type="text" placeholder="Search by name, species, or tag..." style={{ flex: 1 }}
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: 140 }}>
              <option value="favorites">Sort: favorites</option>
              <option value="name">Sort: name</option>
              <option value="rating">Sort: rating</option>
              <option value="recent">Sort: recent</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button onClick={openAddForm}>+ Add spot</button>
          </div>
        </>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: 12 }}>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Spot name *</label>
              <input type="text" placeholder="e.g. Lazzaro" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="field">
              <label>Species present (check all that apply) *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '6px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 10 }}>
                {SPECIES_LIST.map((sp) => (
                  <label key={sp} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.speciesChecked.includes(sp)} onChange={() => toggleSpecies(sp)} />
                    {sp}
                  </label>
                ))}
              </div>
              <input
                type="text" placeholder="Other species not listed (comma separated)" style={{ marginTop: 6 }}
                value={form.speciesOther} onChange={(e) => setForm((f) => ({ ...f, speciesOther: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Google Maps link</label>
              <input type="text" placeholder="Paste a Google Maps share link" value={form.maplink} onChange={(e) => setForm((f) => ({ ...f, maplink: e.target.value }))} />
            </div>
            <div className="field">
              <label>Condition tags (comma separated)</label>
              <input type="text" placeholder="e.g. early morning, after rain, low tide" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} />
            </div>
            <div className="field">
              <label>Notes / recommendations</label>
              <textarea rows={3} style={{ resize: 'vertical' }} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
            <div className="row" style={{ marginBottom: 12, alignItems: 'flex-start' }}>
              <div>
                <label className="muted" style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Rating</label>
                <StarRow rating={form.rating} interactive onChange={(n) => setForm((f) => ({ ...f, rating: n }))} />
              </div>
              <div style={{ marginLeft: 16 }}>
                <label className="muted" style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Favorite</label>
                <button type="button" className="icon-btn" aria-label="Toggle favorite" onClick={() => setForm((f) => ({ ...f, favorite: !f.favorite }))}>
                  <StarIcon filled={form.favorite} />
                </button>
              </div>
            </div>
            <div className="row">
              <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={saving}>
                {saving ? 'Saving...' : (editingId ? 'Update spot' : 'Save spot')}
              </button>
              <button type="button" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        filteredSorted.length === 0 ? (
          <p className="empty-state">No spots match your search.</p>
        ) : (
          filteredSorted.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              catchCount={catchCountBySpot[spot.id] || 0}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          ))
        )
      )}
    </div>
  )
}
