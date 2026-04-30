'use client'

import { useState } from 'react'

const MOCK_BUREAUX = [
  { id: '1', code: 'BV-LIT-001', nom: 'Bureau de Vote Bonanjo-01', region: 'Littoral', adresse: 'Ecole Primaire de Bonanjo, Douala', capacite: 500, inscrits: 487, votes: 312, is_active: true },
  { id: '2', code: 'BV-CEN-001', nom: 'Bureau de Vote Mvog-Ada-01', region: 'Centre', adresse: 'CEG de Mvog-Ada, Yaoundé', capacite: 400, inscrits: 398, votes: 289, is_active: true },
  { id: '3', code: 'BV-OUE-001', nom: 'Bureau de Vote Bafoussam-01', region: 'Ouest', adresse: 'Ecole Publique de Bafoussam I', capacite: 600, inscrits: 554, votes: 401, is_active: true },
  { id: '4', code: 'BV-EXN-001', nom: 'Bureau de Vote Maroua-01', region: 'Extrême-Nord', adresse: 'Lycée de Maroua, Maroua', capacite: 700, inscrits: 680, votes: 502, is_active: true },
  { id: '5', code: 'BV-NOR-001', nom: 'Bureau de Vote Garoua-01', region: 'Nord', adresse: 'CES de Garoua, Garoua', capacite: 450, inscrits: 421, votes: 287, is_active: true },
  { id: '6', code: 'BV-ADA-001', nom: 'Bureau de Vote Ngaoundéré-01', region: 'Adamaoua', adresse: 'Ecole Publique Ngaoundéré II', capacite: 350, inscrits: 312, votes: 198, is_active: true },
  { id: '7', code: 'BV-NOW-001', nom: 'Bureau de Vote Bamenda-01', region: 'Nord-Ouest', adresse: 'Government School Bamenda', capacite: 400, inscrits: 356, votes: 142, is_active: false },
  { id: '8', code: 'BV-SOW-001', nom: 'Bureau de Vote Buea-01', region: 'Sud-Ouest', adresse: 'Government Primary School Buea', capacite: 300, inscrits: 278, votes: 98, is_active: false },
  { id: '9', code: 'BV-EST-001', nom: 'Bureau de Vote Bertoua-01', region: 'Est', adresse: 'Lycée de Bertoua', capacite: 400, inscrits: 367, votes: 241, is_active: true },
  { id: '10', code: 'BV-SUD-001', nom: 'Bureau de Vote Ebolowa-01', region: 'Sud', adresse: 'CEG de Ebolowa', capacite: 350, inscrits: 298, votes: 175, is_active: true },
]

const REGIONS = ['Toutes', 'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral', 'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest']

export default function BureauxPage() {
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('Toutes')
  const [statusFilter, setStatusFilter] = useState<'tous' | 'actif' | 'inactif'>('tous')
  const [showModal, setShowModal] = useState(false)

  const filtered = MOCK_BUREAUX.filter(b => {
    const matchSearch = search === '' || b.nom.toLowerCase().includes(search.toLowerCase()) || b.code.toLowerCase().includes(search.toLowerCase())
    const matchRegion = regionFilter === 'Toutes' || b.region === regionFilter
    const matchStatus = statusFilter === 'tous' || (statusFilter === 'actif' && b.is_active) || (statusFilter === 'inactif' && !b.is_active)
    return matchSearch && matchRegion && matchStatus
  })

  const totalVotes = MOCK_BUREAUX.reduce((a, b) => a + b.votes, 0)
  const totalInscrits = MOCK_BUREAUX.reduce((a, b) => a + b.inscrits, 0)

  const inputStyle = {
    padding: '9px 14px', borderRadius: 7, fontSize: 13,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#E8ECF4',
  } as React.CSSProperties

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: 4 }}>GESTION</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#E8ECF4', margin: 0 }}>Bureaux de Vote</h1>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          padding: '10px 20px', background: '#1565C0', color: '#fff',
          border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}>+ Ajouter un Bureau</button>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Total Bureaux', value: MOCK_BUREAUX.length, color: '#90CAF9' },
          { label: 'Bureaux Actifs', value: MOCK_BUREAUX.filter(b => b.is_active).length, color: '#A5D6A7' },
          { label: 'Total Inscrits', value: totalInscrits.toLocaleString('fr-FR'), color: '#FFF176' },
          { label: 'Total Votes', value: totalVotes.toLocaleString('fr-FR'), color: '#CE93D8' },
        ].map(s => (
          <div key={s.label} style={{
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
          }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', marginBottom: 6 }}>{s.label.toUpperCase()}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap',
        padding: '14px 16px',
        background: 'rgba(13, 31, 60, 0.8)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 10,
      }}>
        <input
          type="text"
          placeholder="🔍  Rechercher par nom, code..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, flex: 1, minWidth: 220 }}
        />
        <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)} style={{ ...inputStyle, minWidth: 150 }}>
          {REGIONS.map(r => <option key={r}>{r}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 4 }}>
          {([
            { key: 'tous', label: 'Tous' },
            { key: 'actif', label: '✓ Actifs' },
            { key: 'inactif', label: '✕ Inactifs' },
          ] as const).map(f => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)} style={{
              padding: '8px 12px',
              background: statusFilter === f.key ? '#1565C0' : 'transparent',
              border: `1px solid ${statusFilter === f.key ? '#1565C0' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 6, fontSize: 12,
              color: statusFilter === f.key ? '#fff' : 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: 'rgba(13, 31, 60, 0.8)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, overflow: 'hidden',
      }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>CODE</th>
              <th>NOM DU BUREAU</th>
              <th>RÉGION</th>
              <th>ADRESSE</th>
              <th>INSCRITS</th>
              <th>VOTES</th>
              <th>PARTICIPATION</th>
              <th>STATUT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => {
              const participation = b.inscrits > 0 ? Math.round(b.votes / b.inscrits * 100) : 0
              return (
                <tr key={b.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#90CAF9' }}>{b.code}</td>
                  <td style={{ fontWeight: 600, color: '#E8ECF4', fontSize: 13 }}>{b.nom}</td>
                  <td style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{b.region}</td>
                  <td style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', maxWidth: 180 }}>{b.adresse}</td>
                  <td style={{ fontSize: 13, color: '#E8ECF4', fontVariantNumeric: 'tabular-nums' }}>{b.inscrits}</td>
                  <td style={{ fontSize: 13, color: '#A5D6A7', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{b.votes}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${participation}%`,
                          background: participation >= 60 ? '#4CAF50' : participation >= 40 ? '#FF9800' : '#F44336',
                          borderRadius: 2,
                        }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: participation >= 60 ? '#A5D6A7' : participation >= 40 ? '#FFCC80' : '#EF9A9A' }}>
                        {participation}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                      background: b.is_active ? 'rgba(76, 175, 80, 0.12)' : 'rgba(244, 67, 54, 0.12)',
                      color: b.is_active ? '#A5D6A7' : '#EF9A9A',
                    }}>{b.is_active ? '✓ Actif' : '✕ Inactif'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button style={{
                        padding: '4px 8px',
                        background: 'rgba(21, 101, 192, 0.12)',
                        border: '1px solid rgba(21, 101, 192, 0.25)',
                        borderRadius: 5, fontSize: 11, color: '#90CAF9', cursor: 'pointer',
                      }}>Voir</button>
                      <button style={{
                        padding: '4px 8px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 5, fontSize: 11, color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
                      }}>Éditer</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            Aucun bureau trouvé
          </div>
        )}

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          fontSize: 12, color: 'rgba(255,255,255,0.35)',
        }}>
          <span>Affichage de {filtered.length} sur {MOCK_BUREAUX.length} bureaux</span>
          <span>Total national: 24 567 bureaux de vote</span>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: '#0D1F3C', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14, padding: 28, width: '100%', maxWidth: 500,
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#E8ECF4', margin: 0 }}>Nouveau Bureau de Vote</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 20, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'NOM DU BUREAU', span: 2, ph: 'Ex: Bureau de Vote Bonanjo-01' },
                { label: 'CODE', ph: 'Ex: BV-LIT-001' },
                { label: 'CAPACITÉ MAX', ph: '500', type: 'number' },
              ].map(f => (
                <div key={f.label} style={{ gridColumn: f.span ? `span ${f.span}` : undefined }}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 5, letterSpacing: '0.06em' }}>{f.label}</label>
                  <input type={f.type || 'text'} placeholder={f.ph} style={{ ...inputStyle, width: '100%' }} />
                </div>
              ))}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 5, letterSpacing: '0.06em' }}>RÉGION</label>
                <select style={{ ...inputStyle, width: '100%' }}>
                  {REGIONS.slice(1).map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 5, letterSpacing: '0.06em' }}>ADRESSE COMPLÈTE</label>
                <input type="text" placeholder="Ex: Ecole Primaire de Bonanjo, Douala" style={{ ...inputStyle, width: '100%' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, fontSize: 13, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>Annuler</button>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 22px', background: '#1565C0', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Créer le Bureau</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
