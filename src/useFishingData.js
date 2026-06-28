import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabaseClient'

export function useFishingData() {
  const [spots, setSpots] = useState([])
  const [catches, setCatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    const [spotsRes, catchesRes] = await Promise.all([
      supabase.from('fishing_spots').select('*').order('created_at', { ascending: true }),
      supabase.from('fishing_catches').select('*').order('catch_date', { ascending: false }),
    ])
    if (spotsRes.error) setError(spotsRes.error.message)
    else setSpots(spotsRes.data)
    if (catchesRes.error) setError(catchesRes.error.message)
    else setCatches(catchesRes.data)
    setLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount; loadAll's setLoading(true) runs synchronously before its await, which is what the rule flags. This is the correct pattern for an initial data load.
    loadAll()

    // Realtime: refresh when any family member adds/edits from another device
    const spotsChannel = supabase
      .channel('fishing-spots-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fishing_spots' }, loadAll)
      .subscribe()
    const catchesChannel = supabase
      .channel('fishing-catches-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fishing_catches' }, loadAll)
      .subscribe()

    return () => {
      supabase.removeChannel(spotsChannel)
      supabase.removeChannel(catchesChannel)
    }
  }, [loadAll])

  async function addSpot(spot) {
    const { error } = await supabase.from('fishing_spots').insert(spot)
    if (error) throw error
  }

  async function updateSpot(id, updates) {
    const { error } = await supabase.from('fishing_spots').update(updates).eq('id', id)
    if (error) throw error
  }

  async function deleteSpot(id) {
    const { error } = await supabase.from('fishing_spots').delete().eq('id', id)
    if (error) throw error
  }

  async function addCatch(catchEntry) {
    const { error } = await supabase.from('fishing_catches').insert(catchEntry)
    if (error) throw error
  }

  async function updateCatch(id, updates) {
    const { error } = await supabase.from('fishing_catches').update(updates).eq('id', id)
    if (error) throw error
  }

  async function deleteCatch(id) {
    const { error } = await supabase.from('fishing_catches').delete().eq('id', id)
    if (error) throw error
  }

  async function uploadPhoto(file) {
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
    const { error } = await supabase.storage.from('catch-photos').upload(fileName, file)
    if (error) throw error
    const { data } = supabase.storage.from('catch-photos').getPublicUrl(fileName)
    return data.publicUrl
  }

  return {
    spots,
    catches,
    loading,
    error,
    addSpot,
    updateSpot,
    deleteSpot,
    addCatch,
    updateCatch,
    deleteCatch,
    uploadPhoto,
    refresh: loadAll,
  }
}
