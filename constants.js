import { useState, useMemo, useRef } from 'react'
import { SPECIES_LIST, LURE_LIST, KNOWN_ANGLERS, compressImage, computePersonalBests } from '../constants'

const EMPTY_FORM = { spotId: '', species: '', size: '', angler: '', anglerOther: '', date: '', lure: '', photoFile: null, photoPreview: null, existingPhotoUrl: null }

function TrashIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 14, height: 14 }}><path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0l-1 14a1 1 0 01-1 1H8a1 1 0 01-1-1L6 6" /></svg>
}
function EditIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 14, height: 14 }}><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
}
function ChevIcon() {
  return <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><path d="M6 9l6 6 6-6" /></svg>
}

function CatchCard({ c, spot, isPB, onEdit, onDelete }) {
  const dateStr = c.catch_date ? new Date(c.catch_date + 'T00:00:00').toLocaleDateString() : ''
  return (
    <div className={`card${isPB ? ' is-favorite' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '0.85rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        {c.photo_url && (
          <img
            src={c.photo_url}
            alt="Catch"
            onClick={() => window.open(c.photo_url, '_blank')}
            style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', cursor: 'pointer', flexShrink: 0 }}
          />
        )}
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 500, fontSize: 14, margin: 0 }}>
            {c.species}{c.size ? ` \u00b7 ${c.size} in` : ''}
            {isPB && <span title="Personal best" style={{ color: 'var(--gold)', marginLeft: 6 }}>{'\ud83c\udfc6 PB'}</span>}
          </p>
          <p className="tiny" style={{ margin: '2px 0 0' }}>
            {spot ? spot.name : 'Unknown spot'}{c.angler ? ` \u00b7 ${c.angler}` : ''}{dateStr ? ` \u00b7 ${dateStr}` : ''}
          </p>
          {c.lure && <p className="tiny" style={{ margin: '2px 0 0', color: 'var(--purple)' }}>Lure: {c.lure}</p>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        <button className="icon-btn" aria-label="Edit catch" onClick={() => onEdit(c)}><EditIcon /></button>
        <button className="icon-btn" aria-label="Delete catch" onClick={() => onDelete(c.id)}><TrashIcon /></button>
      </div>
    </div>
  )
}

export default function CatchesView({ data }) {
  const { spots, catches, addCatch, updateCatch, deleteCatch, uploadPhoto } = data
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [collapsed, setCollapsed] = useState({})
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef(null)

  const pb = useMemo(() => computePersonalBests(catches), [catches])

  const speciesOptions = useMemo(() => {
    const used = catches.map((c) => c.species).filter(Boolean)
    const all = [...SPECIES_LIST]
    used.forEach((u) => { if (!all.some((a) => a.toLowerCase() === u.toLowerCase())) all.push(u) })
    return all.sort((a, b) => a.localeCompare(b))
  }, [catches])

  const lureOptions = useMemo(() => {
    const used = catches.map((c) => c.lure).filter(Boolean)
    const all = [...LURE_LIST]
    used.forEach((u) => { if (!all.some((a) => a.toLowerCase() === u.toLowerCase())) all.push(u) })
    return all.sort((a, b) => a.localeCompare(b))
  }, [catches])

  const groups = useMemo(() => {
    const sorted = [...catches].sort((a, b) => (b.catch_date || '').localeCompare(a.catch_date || ''))
    const byAngler = {}
    const order = []
    sorted.forEach((c) => {
      const key = (c.angler && c.angler.trim()) ? c.angler.trim() : 'Unassigned'
      if (!byAngler[key]) { byAngler[key] = []; order.push(key) }
      byAngler[key].push(c)
    })
    order.sort((a, b) => {
      const ia = KNOWN_ANGLERS.indexOf(a) === -1 ? (a === 'Unassigned' ? 999 : 500) : KNOWN_ANGLERS.indexOf(a)
      const ib = KNOWN_ANGLERS.indexOf(b) === -1 ? (b === 'Unassigned' ? 999 : 500) : KNOWN_ANGLERS.indexOf(b)
      if (ia !== ib) return ia - ib
      return a.localeCompare(b)
    })
    return order.map((name) => ({ name, items: byAngler[name] }))
  }, [catches])

  function openAddForm() {
    setEditingId(null)
    setForm({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10), spotId: spots[0]?.id || '' })
    setShowForm(true)
  }

  function openEditForm(c) {
    setEditingId(c.id)
    const isKnown = KNOWN_ANGLERS.includes(c.angler)
    setForm({
      spotId: c.spot_id || '',
      species: c.species || '',
      size: c.size || '',
      angler: isKnown ? c.angler : (c.angler ? '__other__' : ''),
      anglerOther: isKnown ? '' : (c.angler || ''),
      date: c.catch_date || '',
      lure: c.lure || '',
      photoFile: null,
      photoPreview: c.photo_url || null,
      existingPhotoUrl: c.photo_url || null,
    })
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handlePhotoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    try {
      const blob = await compressImage(file, 1000, 0.8)
      setForm((f) => ({ ...f, photoFile: blob, photoPreview: URL.createObjectURL(blob) }))
    } catch {
      alert('Could not read that photo. Try a different one.')
    }
  }

  function removePhoto() {
    setForm((f) => ({ ...f, photoFile: null, photoPreview: null, existingPhotoUrl: null }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const anglerValue = form.angler === '__other__' ? form.anglerOther.trim() : form.angler
    if (!form.spotId || !form.species) return
    setSaving(true)
    try {
      let photoUrl = form.existingPhotoUrl
      if (form.photoFile) {
        photoUrl = await uploadPhoto(form.photoFile)
      } else if (!form.photoPreview) {
        photoUrl = null
      }
      const payload = {
        spot_id: form.spotId,
        species: form.species,
        size: form.size ? parseFloat(form.size) : null,
        angler: anglerValue,
        catch_date: form.date || null,
        lure: form.lure || null,
        photo_url: photoUrl,
      }
      if (editingId) {
        await updateCatch(editingId, payload)
      } else {
        await addCatch(payload)
      }
      closeForm()
    } catch (err) {
      alert('Could not save that catch: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteCatch(id)
    } catch (err) {
      alert('Could not delete that catch: ' + err.message)
    }
  }

  function toggleGroup(name) {
    setCollapsed((c) => ({ ...c, [name]: !c[name] }))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>Catch log</p>
        <button onClick={openAddForm}>+ Log a catch</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 12 }}>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Spot *</label>
              <select value={form.spotId} onChange={(e) => setForm((f) => ({ ...f, spotId: e.target.value }))} required>
                <option value="">Select a spot</option>
                {spots.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="row">
              <div className="field" style={{ flex: 1 }}>
                <label>Species *</label>
                <select value={form.species} onChange={(e) => setForm((f) => ({ ...f, species: e.target.value }))} required>
                  <option value="">Select species</option>
                  {speciesOptions.map((sp) => <option key={sp} value={sp}>{sp}</option>)}
                </select>
              </div>
              <div className="field" style={{ width: 90 }}>
                <label>Size (in)</label>
                <input type="number" step="0.1" min="0" value={form.size} onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))} />
              </div>
            </div>
            <div className="row">
              <div className="field" style={{ flex: 1 }}>
                <label>Angler</label>
                <select value={form.angler} onChange={(e) => setForm((f) => ({ ...f, angler: e.target.value }))}>
                  <option value="">Select who caught it</option>
                  {KNOWN_ANGLERS.map((a) => <option key={a} value={a}>{a}</option>)}
                  <option value="__other__">Other</option>
                </select>
                {form.angler === '__other__' && (
                  <input
                    type="text" placeholder="Name" style={{ marginTop: 6 }}
                    value={form.anglerOther}
                    onChange={(e) => setForm((f) => ({ ...f, anglerOther: e.target.value }))}
                  />
                )}
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label>Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
              </div>
            </div>
            <div className="field">
              <label>Lure / bait used</label>
              <select value={form.lure} onChange={(e) => setForm((f) => ({ ...f, lure: e.target.value }))}>
                <option value="">No lure logged</option>
                {lureOptions.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Photo</label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} />
              {form.photoPreview && (
                <div style={{ marginTop: 6 }}>
                  <img src={form.photoPreview} alt="Preview" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'block' }} />
                  <button type="button" onClick={removePhoto} style={{ marginTop: 6, fontSize: 12, padding: '4px 10px' }}>Remove photo</button>
                </div>
              )}
            </div>
            <div className="row">
              <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={saving}>
                {saving ? 'Saving...' : (editingId ? 'Update catch' : 'Save catch')}
              </button>
              <button type="button" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {catches.length === 0 ? (
        <p className="empty-state">No catches logged yet. Tap "Log a catch" to start the family record book.</p>
      ) : (
        groups.map((g) => (
          <div className="angler-group" key={g.name}>
            <button
              type="button"
              className={`angler-group-header${collapsed[g.name] ? ' collapsed' : ''}`}
              onClick={() => toggleGroup(g.name)}
            >
              <span className="angler-group-name">
                {g.name}
                <span className="angler-group-count">{g.items.length}</span>
              </span>
              <ChevIcon />
            </button>
            {!collapsed[g.name] && (
              <div className="angler-group-body">
                {g.items.map((c) => (
                  <CatchCard
                    key={c.id}
                    c={c}
                    spot={spots.find((s) => s.id === c.spot_id)}
                    isPB={!!pb.ids[c.id]}
                    onEdit={openEditForm}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
