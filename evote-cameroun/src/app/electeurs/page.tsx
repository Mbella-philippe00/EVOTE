'use client'

import { useState } from 'react'

const MOCK_ELECTEURS = [
  { id: '1', numero: 'CE-LIT-2025-001', nom: 'MBARGA', prenom: 'Jean-Baptiste', sexe: 'M', region: 'Littoral', bureau: 'BV-Bonanjo-01', a_vote: true, date_inscription: '2024-12-01' },
  { id: '2', numero: 'CE-CEN-2025-002', nom: 'ATANGANA', prenom: 'Marie-Claire', sexe: 'F', region: 'Centre', bureau: 'BV-Mvog-Ada-03', a_vote: false, date_inscription: '2025-01-15' },
  { id: '3', numero: 'CE-OUE-2025-003', nom: 'KAMDEM', prenom: 'Paul', sexe: 'M', region: 'Ouest', bureau: 'BV-Bafoussam-01', a_vote: true, date_inscription: '2024-11-20' },
  { id: '4', numero: 'CE-EXN-2025-004', nom: 'AMADOU', prenom: 'Fatoumata', sexe: 'F', region: 'Extrême-Nord', bureau: 'BV-Maroua-02', a_vote: false, date_inscription: '2025-02-01' },
  { id: '5', numero: 'CE-NOR-2025-005', nom: 'ABBA', prenom: 'Ibrahim', sexe: 'M', region: 'Nord', bureau: 'BV-Garoua-01', a_vote: true, date_inscription: '2024-10-10' },
  { id: '6', numero: 'CE-SOW-2025-006', nom: 'EFANGE', prenom: 'Beatrice', sexe: 'F', region: 'Sud-Ouest', bureau: 'BV-Buea-01', a_vote: false, date_inscription: '2025-01-28' },
  { id: '7', numero: 'CE-EST-2025-007', nom: 'MENGUE', prenom: 'Roger', sexe: 'M', region: 'Est', bureau: 'BV-Bertoua-01', a_vote: true, date_inscription: '2024-09-15' },
  { id: '8', numero: 'CE-SUD-2025-008', nom: 'EKWALLA', prenom: 'Christiane', sexe: 'F', region: 'Sud', bureau: 'BV-Ebolowa-01', a_vote: false, date_inscription: '2025-01-05' },
  { id: '9', numero: 'CE-ADA-2025-009', nom: 'HAMADOU', prenom: 'Oumarou', sexe: 'M', region: 'Adamaoua', bureau: 'BV-Ngaoundere-01', a_vote: true, date_inscription: '2024-12-20' },
  { id: '10', numero: 'CE-NOW-2025-010', nom: 'NJOYA', prenom: 'Scholastique', sexe: 'F', region: 'Nord-Ouest', bureau: 'BV-Bamenda-02', a_vote: false, date_inscription: '2025-02-10' },
]

const REGIONS = ['Toutes', 'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral', 'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest']

export default function ElecteursPage() {
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('Toutes')
  const [voteFilter, setVoteFilter] = useState<'tous' | 'vote' | 'pas_vote'>('tous')
  const [showModal, setShowModal] = useState(false)

  const filtered = MOCK_ELECTEURS.filter(e => {
    const matchSearch = search === '' ||
      e.nom.toLowerCase().includes(search.toLowerCase()) ||
      e.prenom.toLowerCase().includes(search.toLowerCase()) ||
      e.numero.toLowerCase().includes(search.toLowerCase())
    const matchRegion = regionFilter === 'Toutes' || e.region === regionFilter
    const matchVote = voteFilter === 'tous' ||
      (voteFilter === 'vote' && e.a_vote) ||
      (voteFilter === 'pas_vote' && !e.a_vote)
    return matchSearch && matchRegion && matchVote
  })

  const inputStyle = {
    padding: '9px 14px', borderRadius: 7, fontSize: 13,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#E8ECF4',
  } as React.CSSProperties

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: 4 }}>GESTION</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#E8ECF4', margin: 0 }}>Électeurs Inscrits</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '10px 20px',
            background: '#007A3D', color: '#fff', border: 'none',
            borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}
        >
          + Inscrire un Électeur
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Total inscrits', value: MOCK_ELECTEURS.length, color: '#90CAF9' },
          { label: 'Ont voté', value: MOCK_ELECTEURS.filter(e => e.a_vote).length, color: '#A5D6A7' },
          { label: "N'ont pas voté", value: MOCK_ELECTEURS.filter(e => !e.a_vote).length, color: '#EF9A9A' },
          { label: 'Taux', value: `${Math.round(MOCK_ELECTEURS.filter(e => e.a_vote).length / MOCK_ELECTEURS.length * 100)}%`, color: '#FFF176' },
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
          placeholder="🔍  Rechercher par nom, prénom, numéro..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, flex: 1, minWidth: 240 }}
        />
        <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)} style={{ ...inputStyle, minWidth: 150 }}>
          {REGIONS.map(r => <option key={r}>{r}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 4 }}>
          {([
            { key: 'tous', label: 'Tous' },
            { key: 'vote', label: '✓ Ont voté' },
            { key: 'pas_vote', label: '○ N\'ont pas voté' },
          ] as const).map(f => (
            <button key={f.key} onClick={() => setVoteFilter(f.key)} style={{
              padding: '8px 12px',
              background: voteFilter === f.key ? '#1565C0' : 'transparent',
              border: `1px solid ${voteFilter === f.key ? '#1565C0' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 6, fontSize: 12,
              color: voteFilter === f.key ? '#fff' : 'rgba(255,255,255,0.45)',
              cursor: 'pointer', whiteSpace: 'nowrap',
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
              <th>N° CARTE ÉLECT.</th>
              <th>NOM COMPLET</th>
              <th>SEXE</th>
              <th>RÉGION</th>
              <th>BUREAU DE VOTE</th>
              <th>INSCRIPTION</th>
              <th>STATUT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id}>
                <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#90CAF9' }}>{e.numero}</td>
                <td>
                  <div style={{ fontWeight: 600, color: '#E8ECF4' }}>{e.nom} {e.prenom}</div>
                </td>
                <td>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 24, height: 24, borderRadius: '50%', fontSize: 11, fontWeight: 700,
                    background: e.sexe === 'F' ? 'rgba(233, 30, 99, 0.15)' : 'rgba(21, 101, 192, 0.15)',
                    color: e.sexe === 'F' ? '#F48FB1' : '#90CAF9',
                  }}>{e.sexe}</span>
                </td>
                <td style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{e.region}</td>
                <td style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{e.bureau}</td>
                <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{e.date_inscription}</td>
                <td>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                    background: e.a_vote ? 'rgba(76, 175, 80, 0.12)' : 'rgba(255,152,0,0.12)',
                    color: e.a_vote ? '#A5D6A7' : '#FFCC80',
                  }}>
                    {e.a_vote ? '✓ A voté' : '○ En attente'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{
                      padding: '4px 10px',
                      background: 'rgba(21, 101, 192, 0.12)',
                      border: '1px solid rgba(21, 101, 192, 0.25)',
                      borderRadius: 5, fontSize: 11, color: '#90CAF9', cursor: 'pointer',
                    }}>Voir</button>
                    <button style={{
                      padding: '4px 10px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 5, fontSize: 11, color: 'rgba(255,255,255,0.45)', cursor: 'pointer',
                    }}>Éditer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            Aucun électeur trouvé avec ces critères
          </div>
        )}

        {/* Pagination bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            Affichage de {filtered.length} sur {MOCK_ELECTEURS.length} électeurs
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, '...', 10].map((p, i) => (
              <button key={i} style={{
                width: 30, height: 30,
                background: p === 1 ? '#1565C0' : 'transparent',
                border: `1px solid ${p === 1 ? '#1565C0' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 5, fontSize: 12,
                color: p === 1 ? '#fff' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Add Electeur */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }} onClick={() => setShowModal(false)}>
          <div
            style={{
              background: '#0D1F3C', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14, padding: 28, width: '100%', maxWidth: 540,
              maxHeight: '90vh', overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#E8ECF4', margin: 0 }}>
                Inscrire un Électeur
              </h2>
              <button onClick={() => setShowModal(false)} style={{
                background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)',
                fontSize: 20, cursor: 'pointer',
              }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'NOM', placeholder: 'Ex: MBARGA' },
                { label: 'PRÉNOM', placeholder: 'Ex: Jean' },
                { label: 'DATE DE NAISSANCE', placeholder: '', type: 'date' },
                { label: 'LIEU DE NAISSANCE', placeholder: 'Ex: Yaoundé' },
                { label: 'N° CNI', placeholder: 'Ex: 123456789' },
                { label: 'PROFESSION', placeholder: 'Ex: Enseignant' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 5, letterSpacing: '0.06em' }}>
                    {f.label}
                  </label>
                  <input type={f.type || 'text'} placeholder={f.placeholder} style={{ ...inputStyle, width: '100%' }} />
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 5, letterSpacing: '0.06em' }}>SEXE</label>
                <select style={{ ...inputStyle, width: '100%' }}>
                  <option>Masculin</option>
                  <option>Féminin</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 5, letterSpacing: '0.06em' }}>RÉGION</label>
                <select style={{ ...inputStyle, width: '100%' }}>
                  {REGIONS.slice(1).map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowModal(false)} style={{
                padding: '10px 20px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7,
                fontSize: 13, color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
              }}>Annuler</button>
              <button onClick={() => setShowModal(false)} style={{
                padding: '10px 24px', background: '#007A3D', border: 'none',
                borderRadius: 7, fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer',
              }}>Inscrire l&apos;Électeur</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
