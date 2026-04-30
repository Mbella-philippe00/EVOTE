'use client'

import { RegionStats } from '@/types'
import { CANDIDATS_MOCK } from '@/lib/mock-data'

interface Props {
  stats: RegionStats
  onClose: () => void
}

export default function RegionPanel({ stats, onClose }: Props) {
  const leadingCandidat = stats.resultats_candidats[0]
  const candidatColors: Record<string, string> = {}
  CANDIDATS_MOCK.forEach(c => { candidatColors[c.id] = c.couleur })

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: 20,
      }}>
        <div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginBottom: 4 }}>
            RÉGION SÉLECTIONNÉE
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#E8ECF4' }}>
            {stats.region_nom}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >×</button>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Inscrits', value: stats.total_electeurs.toLocaleString('fr-FR'), color: '#90CAF9' },
          { label: 'Votes', value: stats.total_votes.toLocaleString('fr-FR'), color: '#A5D6A7' },
          { label: 'Participation', value: `${stats.taux_participation.toFixed(1)}%`, color: '#FFF176' },
          { label: 'Abstention', value: `${(100 - stats.taux_participation).toFixed(1)}%`, color: '#EF9A9A' },
        ].map(s => (
          <div key={s.label} style={{
            padding: '10px 12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 8,
          }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4, letterSpacing: '0.06em' }}>
              {s.label.toUpperCase()}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Participation bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          height: 6, borderRadius: 3,
          background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 3,
            width: `${stats.taux_participation}%`,
            background: stats.taux_participation >= 60 ? '#4CAF50' : '#FF9800',
            transition: 'width 0.8s ease',
          }} />
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 5 }}>
          Taux de participation régional
        </div>
      </div>

      {/* Leader */}
      {leadingCandidat && (
        <div style={{
          padding: '12px 14px',
          background: 'rgba(0, 122, 61, 0.1)',
          border: '1px solid rgba(0, 122, 61, 0.25)',
          borderRadius: 8, marginBottom: 16,
        }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4, letterSpacing: '0.06em' }}>
            EN TÊTE DANS CETTE RÉGION
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#E8ECF4' }}>
                {leadingCandidat.candidat_nom}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                {leadingCandidat.parti}
              </div>
            </div>
            <div style={{
              fontSize: 22, fontWeight: 700, color: '#A5D6A7'
            }}>
              {leadingCandidat.pourcentage.toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      {/* Results by candidate */}
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', marginBottom: 10 }}>
        RÉSULTATS PAR CANDIDAT
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {stats.resultats_candidats.map((r, i) => (
          <div key={r.candidat_id} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontSize: 12.5, color: '#E8ECF4' }}>
                <span style={{ color: 'rgba(255,255,255,0.35)', marginRight: 6 }}>{i + 1}.</span>
                {r.candidat_nom}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                  {r.votes.toLocaleString('fr-FR')}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: candidatColors[r.candidat_id] || '#90CAF9', minWidth: 38, textAlign: 'right' }}>
                  {r.pourcentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div style={{
              height: 4, borderRadius: 2,
              background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 2,
                width: `${r.pourcentage}%`,
                background: candidatColors[r.candidat_id] || '#1565C0',
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
