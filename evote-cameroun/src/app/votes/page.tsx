'use client'

import { useState } from 'react'
import { CANDIDATS_MOCK } from '@/lib/mock-data'

type VoteStatus = 'idle' | 'searching' | 'found' | 'voting' | 'success' | 'error'

const MOCK_ELECTEURS_LOOKUP: Record<string, { nom: string; prenom: string; region: string; bureau: string; a_vote: boolean }> = {
  'CE-LIT-2025-001': { nom: 'MBARGA', prenom: 'Jean-Baptiste', region: 'Littoral', bureau: 'BV-Bonanjo-01', a_vote: true },
  'CE-CEN-2025-002': { nom: 'ATANGANA', prenom: 'Marie-Claire', region: 'Centre', bureau: 'BV-Mvog-Ada-03', a_vote: false },
  'CE-OUE-2025-003': { nom: 'KAMDEM', prenom: 'Paul', region: 'Ouest', bureau: 'BV-Bafoussam-01', a_vote: false },
  'CE-EXN-2025-004': { nom: 'AMADOU', prenom: 'Fatoumata', region: 'Extrême-Nord', bureau: 'BV-Maroua-02', a_vote: false },
}

export default function VotesPage() {
  const [numCarte, setNumCarte] = useState('')
  const [status, setStatus] = useState<VoteStatus>('idle')
  const [electeur, setElecteur] = useState<typeof MOCK_ELECTEURS_LOOKUP[string] | null>(null)
  const [selectedCandidat, setSelectedCandidat] = useState<string | null>(null)
  const [confirmStep, setConfirmStep] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [recentVotes] = useState([
    { heure: '17:58', bureau: 'BV-Bonanjo-01', region: 'Littoral', candidat: 'RDPC' },
    { heure: '17:55', bureau: 'BV-Mvog-Ada-03', region: 'Centre', candidat: 'MRC' },
    { heure: '17:53', bureau: 'BV-Bafoussam-01', region: 'Ouest', candidat: 'RDPC' },
    { heure: '17:51', bureau: 'BV-Maroua-02', region: 'Extrême-Nord', candidat: 'RDPC' },
    { heure: '17:49', bureau: 'BV-Garoua-01', region: 'Nord', candidat: 'RDPC' },
  ])

  async function handleSearch() {
    setStatus('searching')
    setElecteur(null)
    setSelectedCandidat(null)
    setConfirmStep(false)
    await new Promise(r => setTimeout(r, 700))
    const found = MOCK_ELECTEURS_LOOKUP[numCarte.trim().toUpperCase()]
    if (!found) {
      setStatus('error')
      setErrorMsg('Électeur introuvable. Vérifiez le numéro de carte électorale.')
      return
    }
    setElecteur(found)
    setStatus('found')
  }

  async function handleVote() {
    if (!selectedCandidat || !electeur) return
    setStatus('voting')
    await new Promise(r => setTimeout(r, 1200))
    setStatus('success')
  }

  function handleReset() {
    setNumCarte('')
    setStatus('idle')
    setElecteur(null)
    setSelectedCandidat(null)
    setConfirmStep(false)
    setErrorMsg('')
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: 4 }}>SIMULATION</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#E8ECF4', margin: 0 }}>Simulation de Vote Sécurisé</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
          Entrez le numéro de carte électorale pour initier un vote
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        {/* Left: vote flow */}
        <div>
          {/* Step 1: Search */}
          <div style={{
            background: 'rgba(13, 31, 60, 0.8)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, padding: 20, marginBottom: 14,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#90CAF9', marginBottom: 14, letterSpacing: '0.06em' }}>
              ÉTAPE 1 — IDENTIFICATION DE L&apos;ÉLECTEUR
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                placeholder="Ex: CE-LIT-2025-001 ou CE-CEN-2025-002"
                value={numCarte}
                onChange={e => { setNumCarte(e.target.value); setStatus('idle') }}
                disabled={status === 'voting' || status === 'success'}
                style={{
                  flex: 1, padding: '11px 14px', borderRadius: 8, fontSize: 13,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#E8ECF4', fontFamily: 'monospace',
                }}
              />
              <button
                onClick={handleSearch}
                disabled={!numCarte.trim() || status === 'searching' || status === 'voting' || status === 'success'}
                style={{
                  padding: '11px 20px', background: '#1565C0', color: '#fff',
                  border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                {status === 'searching' ? 'Recherche...' : '🔍 Identifier'}
              </button>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
              Essayez: CE-CEN-2025-002 · CE-OUE-2025-003 · CE-EXN-2025-004
            </div>

            {status === 'error' && (
              <div style={{
                marginTop: 12, padding: '10px 14px',
                background: 'rgba(206, 17, 38, 0.1)', border: '1px solid rgba(206, 17, 38, 0.25)',
                borderRadius: 8, fontSize: 13, color: '#EF9A9A',
              }}>⚠️ {errorMsg}</div>
            )}

            {(status === 'found' || status === 'voting' || status === 'success') && electeur && (
              <div style={{
                marginTop: 12, padding: '14px',
                background: electeur.a_vote ? 'rgba(244, 67, 54, 0.08)' : 'rgba(76, 175, 80, 0.08)',
                border: `1px solid ${electeur.a_vote ? 'rgba(244,67,54,0.25)' : 'rgba(76,175,80,0.25)'}`,
                borderRadius: 8,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#E8ECF4' }}>
                      {electeur.nom} {electeur.prenom}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>
                      {electeur.region} · {electeur.bureau}
                    </div>
                    <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                      N°: {numCarte.toUpperCase()}
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700,
                    background: electeur.a_vote ? 'rgba(244,67,54,0.15)' : 'rgba(76,175,80,0.15)',
                    color: electeur.a_vote ? '#EF9A9A' : '#A5D6A7',
                  }}>
                    {electeur.a_vote ? '✕ Déjà voté' : '✓ Peut voter'}
                  </span>
                </div>
                {electeur.a_vote && (
                  <div style={{ marginTop: 10, fontSize: 12, color: '#EF9A9A' }}>
                    ⚠️ Cet électeur a déjà exercé son droit de vote. Conformément à l&apos;article 97 du Code Electoral, le double vote est interdit et punissable.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Choose candidate */}
          {status === 'found' && electeur && !electeur.a_vote && (
            <div style={{
              background: 'rgba(13, 31, 60, 0.8)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: 20, marginBottom: 14,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#90CAF9', marginBottom: 14, letterSpacing: '0.06em' }}>
                ÉTAPE 2 — CHOIX DU CANDIDAT
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {CANDIDATS_MOCK.map(c => (
                  <div
                    key={c.id}
                    onClick={() => { setSelectedCandidat(c.id); setConfirmStep(false) }}
                    style={{
                      padding: '12px 14px', borderRadius: 8, cursor: 'pointer',
                      background: selectedCandidat === c.id ? c.couleur + '18' : 'rgba(255,255,255,0.02)',
                      border: `1.5px solid ${selectedCandidat === c.id ? c.couleur : 'rgba(255,255,255,0.06)'}`,
                      display: 'flex', alignItems: 'center', gap: 12,
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: c.couleur + '22', border: `2px solid ${c.couleur}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: c.couleur,
                    }}>{c.sigle.substring(0, 2)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#E8ECF4' }}>{c.nom} {c.prenom}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{c.parti}</div>
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>N°{c.id.replace('c', '')}</div>
                    {selectedCandidat === c.id && (
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: c.couleur, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 11, color: '#fff', flexShrink: 0,
                      }}>✓</div>
                    )}
                  </div>
                ))}
              </div>

              {selectedCandidat && !confirmStep && (
                <button
                  onClick={() => setConfirmStep(true)}
                  style={{
                    marginTop: 16, width: '100%', padding: '12px',
                    background: '#1565C0', color: '#fff', border: 'none',
                    borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  Confirmer le Choix →
                </button>
              )}

              {selectedCandidat && confirmStep && (
                <div style={{
                  marginTop: 14, padding: '14px',
                  background: 'rgba(255, 193, 7, 0.08)',
                  border: '1px solid rgba(255, 193, 7, 0.25)',
                  borderRadius: 8,
                }}>
                  <div style={{ fontSize: 13, color: '#FFF176', fontWeight: 600, marginBottom: 10 }}>
                    ⚠️ Confirmation finale — Cette action est irréversible
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>
                    Vous allez enregistrer le vote de <strong style={{ color: '#E8ECF4' }}>{electeur.nom} {electeur.prenom}</strong> pour le candidat <strong style={{ color: CANDIDATS_MOCK.find(c => c.id === selectedCandidat)?.couleur }}>{CANDIDATS_MOCK.find(c => c.id === selectedCandidat)?.nom} {CANDIDATS_MOCK.find(c => c.id === selectedCandidat)?.prenom}</strong>.
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setConfirmStep(false)} style={{
                      flex: 1, padding: '11px', background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7,
                      fontSize: 13, color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                    }}>Modifier</button>
                    <button onClick={handleVote} style={{
                      flex: 2, padding: '11px', background: '#007A3D',
                      border: 'none', borderRadius: 7,
                      fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer',
                    }}>✓ Valider le Vote Définitivement</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Success */}
          {status === 'success' && (
            <div style={{
              background: 'rgba(0, 122, 61, 0.1)',
              border: '1px solid rgba(0, 122, 61, 0.3)',
              borderRadius: 12, padding: 28, textAlign: 'center',
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🗳️</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#A5D6A7', marginBottom: 8 }}>
                Vote Enregistré avec Succès
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>
                Le vote de {electeur?.nom} {electeur?.prenom} a été comptabilisé de manière sécurisée et irréversible.
              </div>
              <button onClick={handleReset} style={{
                padding: '12px 28px', background: '#1565C0', color: '#fff',
                border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}>Voter Suivant →</button>
            </div>
          )}

          {status === 'voting' && (
            <div style={{
              background: 'rgba(13, 31, 60, 0.8)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: 40, textAlign: 'center',
            }}>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>⏳ Enregistrement du vote en cours...</div>
            </div>
          )}
        </div>

        {/* Right: recent votes feed */}
        <div>
          <div style={{
            background: 'rgba(13, 31, 60, 0.8)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, padding: 18,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#90CAF9', marginBottom: 14, letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4CAF50' }} />
              FLUX VOTES EN DIRECT
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentVotes.map((v, i) => (
                <div key={i} style={{
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', minWidth: 38 }}>
                    {v.heure}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: '#E8ECF4', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {v.bureau}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{v.region}</div>
                  </div>
                  <span style={{
                    padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                    background: v.candidat === 'RDPC' ? 'rgba(0, 122, 61, 0.2)' : 'rgba(206, 17, 38, 0.2)',
                    color: v.candidat === 'RDPC' ? '#A5D6A7' : '#EF9A9A',
                  }}>{v.candidat}</span>
                </div>
              ))}
            </div>

            {/* Stats box */}
            <div style={{ marginTop: 16, padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', marginBottom: 10 }}>STATISTIQUES EN TEMPS RÉEL</div>
              {[
                { label: 'Votes/heure', val: '12 450' },
                { label: 'Votes/minute', val: '208' },
                { label: 'Bureaux actifs', val: '22 341' },
                { label: 'Incidents signalés', val: '3' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#E8ECF4' }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
