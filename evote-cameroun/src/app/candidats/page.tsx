'use client'

import { useState } from 'react'
import { CANDIDATS_MOCK } from '@/lib/mock-data'

export default function CandidatsPage() {
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<typeof CANDIDATS_MOCK[0] | null>(null)

  const total_votes = CANDIDATS_MOCK.reduce((a, c) => a + c.votes, 0)

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: 4 }}>GESTION</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#E8ECF4', margin: 0 }}>Candidats à la Présidentielle</h1>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          padding: '10px 20px', background: '#1565C0', color: '#fff',
          border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}>+ Ajouter un Candidat</button>
      </div>

      {/* Candidates grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {CANDIDATS_MOCK.map((c, i) => (
          <div
            key={c.id}
            style={{
              background: 'rgba(13, 31, 60, 0.8)',
              border: `1px solid ${i === 0 ? 'rgba(0, 122, 61, 0.3)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 12, padding: 18, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onClick={() => setSelected(c)}
          >
            {/* Rank badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: c.couleur + '22',
                  border: `2px solid ${c.couleur}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: c.couleur,
                }}>
                  {c.sigle.substring(0, 2)}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#E8ECF4' }}>{c.nom}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{c.prenom}</div>
                </div>
              </div>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4,
              }}>
                <span style={{
                  padding: '2px 8px', borderRadius: 12,
                  background: c.couleur + '22', color: c.couleur,
                  fontSize: 10, fontWeight: 700,
                }}>{c.parti}</span>
                {i === 0 && (
                  <span style={{
                    padding: '2px 8px', borderRadius: 12,
                    background: 'rgba(0, 122, 61, 0.2)', color: '#A5D6A7',
                    fontSize: 9, fontWeight: 700,
                  }}>EN TÊTE</span>
                )}
              </div>
            </div>

            {/* Results */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                  {c.votes.toLocaleString('fr-FR')} votes
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: c.couleur }}>
                  {c.pourcentage}%
                </span>
              </div>
              <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 3,
                  width: `${c.pourcentage}%`,
                  background: c.couleur,
                }} />
              </div>
            </div>

            {/* Mini stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              {[
                { label: 'Rang', val: `#${i + 1}` },
                { label: 'N° Ordre', val: `0${c.id.replace('c', '')}` },
                { label: 'Part', val: `${c.pourcentage}%` },
              ].map(s => (
                <div key={s.label} style={{
                  padding: '6px 0', textAlign: 'center',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 6,
                }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>{s.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: c.couleur, marginTop: 2 }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Table summary */}
      <div style={{
        marginTop: 20,
        background: 'rgba(13, 31, 60, 0.8)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, overflow: 'hidden',
      }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#E8ECF4', margin: 0 }}>
            Récapitulation Officielle des Votes
          </h2>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ORDRE</th>
              <th>CANDIDAT</th>
              <th>PARTI</th>
              <th>VOTES</th>
              <th>POURCENTAGE</th>
              <th>STATUT</th>
            </tr>
          </thead>
          <tbody>
            {CANDIDATS_MOCK.map((c, i) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 700, color: 'rgba(255,255,255,0.5)', width: 50 }}>#{i + 1}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: c.couleur + '22', border: `1.5px solid ${c.couleur}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 700, color: c.couleur, flexShrink: 0,
                    }}>{c.sigle.substring(0, 2)}</div>
                    <span style={{ fontWeight: 600, color: '#E8ECF4', fontSize: 13 }}>
                      {c.nom} {c.prenom}
                    </span>
                  </div>
                </td>
                <td>
                  <span style={{
                    padding: '2px 8px', borderRadius: 4,
                    background: c.couleur + '1A', color: c.couleur,
                    fontSize: 11, fontWeight: 600,
                  }}>{c.parti}</span>
                </td>
                <td style={{ fontVariantNumeric: 'tabular-nums', color: '#E8ECF4', fontWeight: 600 }}>
                  {c.votes.toLocaleString('fr-FR')}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', minWidth: 80 }}>
                      <div style={{ height: '100%', width: `${c.pourcentage}%`, background: c.couleur, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.couleur, minWidth: 40, textAlign: 'right' }}>
                      {c.pourcentage}%
                    </span>
                  </div>
                </td>
                <td>
                  <span style={{
                    padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                    background: i === 0 ? 'rgba(0, 122, 61, 0.15)' : 'rgba(255,255,255,0.05)',
                    color: i === 0 ? '#A5D6A7' : 'rgba(255,255,255,0.4)',
                  }}>
                    {i === 0 ? '🏆 En tête' : 'En lice'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <td colSpan={3} style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                TOTAL NATIONAL
              </td>
              <td style={{ padding: '12px 16px', fontWeight: 700, color: '#E8ECF4', fontSize: 14 }}>
                {total_votes.toLocaleString('fr-FR')}
              </td>
              <td style={{ padding: '12px 16px', fontWeight: 700, color: '#E8ECF4' }}>100%</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
