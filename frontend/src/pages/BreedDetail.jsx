import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Droplet, Truck, Layers, MapPin, Shield } from 'lucide-react'
import { getBreedSignature } from '../utils/breedSignature'

const PURPOSE_ICONS = { dairy: Droplet, draft: Truck, dual: Layers }

const STATUS_STYLES = {
  common    : 'bg-green-50 text-green-700 border-green-200',
  vulnerable: 'bg-amber-50 text-amber-700 border-amber-200',
  endangered: 'bg-red-50 text-red-700 border-red-200',
}

export default function BreedDetail() {
  const { name }  = useParams()
  const navigate  = useNavigate()
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(false)

  useEffect(() => {
    axios.get(`http://localhost:5000/api/breeds/${name}`)
      .then(res => { setData(res.data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [name])

  if (loading) return (
    <div className="min-h-screen bg-canvas flex items-center justify-center text-muted">
      Loading breed details...
    </div>
  )

  if (error || !data) return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center gap-4">
      <p className="text-muted">Breed not found.</p>
      <button onClick={() => navigate(-1)} className="text-accent text-sm">
        ← Go back
      </button>
    </div>
  )

  const { breed, sightings } = data
  const sig  = getBreedSignature({
    name: breed.name, type: breed.type, purpose: breed.purpose
  })
  const Icon = PURPOSE_ICONS[breed.purpose] || Layers

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-line bg-white/80 backdrop-blur-md px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-line text-muted hover:text-ink transition-colors">
          <ArrowLeft size={18} />
        </button>
        <span className="font-display font-bold text-ink">
          Breed details
        </span>
      </header>

      <div className="relative h-52 overflow-hidden flex items-end p-6" style={{ backgroundColor: sig.color }} >
        {[0, 1, 2].map(i => (
          sig.pattern === 'organic' ? (
            <div key={i} className="absolute rounded-full" style={{ 
                   top  : `${(sig.seed * (i + 1) * 3) % 70}%`,
                   left : `${(sig.seed * (i + 2) * 7) % 80}%`,
                   width: `${80 + i * 40}px`,
                   height: `${80 + i * 40}px`,
                   backgroundColor: sig.colorSoft,
                   opacity: 0.35,
                 }} />
          ) : (
            <div key={i} className="absolute"
                 style={{
                   top  : `${(sig.seed * (i + 1) * 3) % 70}%`,
                   left : `${(sig.seed * (i + 2) * 7) % 80}%`,
                   width: `${100 + i * 40}px`,
                   height: `${100 + i * 40}px`,
                   backgroundColor: sig.colorSoft,
                   opacity: 0.35,
                   transform: 'rotate(35deg)',
                 }} />
          )
        ))}

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Icon size={16} color="white" opacity={0.8} />
            <span className="text-xs text-white/80 uppercase tracking-wider font-medium">
              {breed.type} · {breed.purpose}
            </span>
          </div>
          <h1 className="font-display font-bold text-white text-5xl">
            {breed.name}
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon : MapPin,
              label: 'Origin',
              value: breed.origin_state || '—'
            },
            {
              icon : Icon,
              label: 'Purpose',
              value: breed.purpose
                ? breed.purpose.charAt(0).toUpperCase()
                  + breed.purpose.slice(1)
                : '—'
            },
            {
              icon : Shield,
              label: 'Status',
              value: breed.conservation_status
                ? breed.conservation_status.charAt(0).toUpperCase()
                  + breed.conservation_status.slice(1)
                : '—'
            },
          ].map(fact => (
            <div key={fact.label} className="bg-surface border border-line rounded-xl p-4 text-center">
              <fact.icon size={16} className="text-accent mx-auto mb-2" />
              <p className="text-xs text-muted mb-0.5">{fact.label}</p>
              <p className="font-display font-bold text-sm text-ink">
                {fact.value}
              </p>
            </div>
          ))}
        </div>

        {breed.description && (
          <div className="bg-surface border border-line rounded-2xl p-6">
            <h2 className="font-display font-bold text-ink mb-3">
              About this breed
            </h2>
            <p className="text-muted leading-relaxed text-sm">
              {breed.description}
            </p>
          </div>
        )}
        {breed.physical_traits && (
          <div className="bg-surface border border-line rounded-2xl p-6">
            <h2 className="font-display font-bold text-ink mb-3">
              How to identify
            </h2>
            <p className="text-muted leading-relaxed text-sm">
              {breed.physical_traits}
            </p>
          </div>
        )}

        {sightings && sightings.total_identifications > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h2 className="font-display font-bold text-ink mb-1">
              Field sightings
            </h2>
            <p className="text-sm text-muted mb-3">
              Recorded through Bharat Pashudhan
            </p>
            <p className="font-display font-bold text-3xl text-accent">
              {sightings.total_identifications}
            </p>
            <p className="text-sm text-muted">
              times identified in the field
            </p>
            {sightings.last_seen && (
              <p className="text-xs text-muted mt-2">
                Last seen:{' '}
                {new Date(sightings.last_seen).toLocaleDateString('en-IN')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}