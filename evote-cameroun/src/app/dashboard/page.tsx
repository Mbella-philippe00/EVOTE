'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { DASHBOARD_STATS_MOCK, CANDIDATS_MOCK } from '@/lib/mock-data'
import { RegionStats } from '@/types'

const CameroonMap = dynamic(() => import('@/components/map/CameroonMap'), { ssr: false })
const RegionPanel = dynamic(() => import('@/components/map/RegionPanel'), { ssr: false })

// Recharts imports — only used in this client component
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts'

const stats = DASHBOARD_STATS_MOCK

const PARTICIPATION_DATA = stats.regions_stats.map(r => ({
  region: r.region_nom.replace('Extrême-', 'Extr.').replace('-Ouest', '-O.').substring(0, 8),
  participation: Number(r.taux_participation.toFixed(1)),
}))

const GENRE_DATA = [
  { name: 'Femmes', value: 48, color: '#E91E63' },
  { name: 'Hommes', value: 52, color: '#1565C0' },
]

const VOTE_TIMELINE = [
  { heure: '08h', votes: 124000 },
  { heure: '09h', votes: 345000 },
  { heure: '10h', votes: 612000 },
  { heure: '11h', votes: 890000 },
  { heure: '12h', votes: 1102000 },
  { heure: '13h', votes: 1298000 },
  { heure: '14h', votes: 1580000 },
  { heure: '15h', votes: 1890000 },
  { heure: '16h', votes: 2134000 },
  { heure: '17h', votes: 2456000 },
  { heure: '18h', votes: 4584260 },
]

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div style={{
      padding: '16px 20px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12,
      position: 'relative', overflow: 'hidden',
    }}>
      {accent && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: accent,
        }} />
      )}
      <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#E8ECF4', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{sub}</div>
      )}
    </div>
  )
}

function CandidatCard({ candidat, rank }: { candidat: typeof CANDIDATS_MOCK[0]; rank: number }) {
  return (
    <div style={{
      padding: '14px 16px',
      background: rank === 0 ? 'rgba(0, 122, 61, 0.08)' : 'rgba(255,255,255,0.025)',
      border: `1px solid ${rank === 0 ? 'rgba(0, 122, 61, 0.2)' : 'rgba(255,255,255,0.05)'}`,
      borderRadius: 10,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: candidat.couleur + '33',
            border: `2px solid ${candidat.couleur}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: candidat.couleur,
          }}>
            {candidat.sigle.substring(0, 2)}
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#E8ECF4' }}>
              {candidat.nom}
            </div>
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)' }}>
              {candidat.parti} · {candidat.prenom}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: candidat.couleur }}>
            {candidat.pourcentage}%
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
            {(candidat.votes / 1000).toFixed(0)}k votes
          </div>
        </div>
      </div>
      {/* Mini bar */}
      <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2,
          width: `${candidat.pourcentage}%`,
          background: candidat.couleur,
          transition: 'width 0.8s ease',
        }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
        {[
          { label: 'Popularité', val: `${(candidat.pourcentage * 0.95).toFixed(0)}%` },
          { label: 'Win Rate', val: `${(candidat.pourcentage * 1.02).toFixed(0)}%` },
          { label: 'Position', val: `#${rank + 1}` },
        ].map(m => (
          <div key={m.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>{m.label}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: candidat.couleur }}>{m.val}</div>
            <div style={{ height: 2, background: candidat.couleur + '40', borderRadius: 1, marginTop: 2 }}>
              <div style={{ height: '100%', width: m.val, background: candidat.couleur, borderRadius: 1 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [selectedRegion, setSelectedRegion] = useState<RegionStats | null>(null)
  const [activeTab, setActiveTab] = useState<'tous' | '2h' | '4h' | '8h'>('tous')

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: 4 }}>
            TABLEAU DE BORD ÉLECTORAL
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#E8ECF4', margin: 0, letterSpacing: '-0.02em' }}>
            Élection Présidentielle 2025
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px',
            background: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid rgba(76, 175, 80, 0.25)',
            borderRadius: 20, fontSize: 12, color: '#A5D6A7',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4CAF50' }} />
            Vote en cours · Dépouillement 100%
          </div>
          <div style={{
            padding: '6px 14px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, fontSize: 11, color: 'rgba(255,255,255,0.5)',
          }}>
            Màj: 18:00
          </div>
        </div>
      </div>

      {/* Countdown-style KPIs (like design 1) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard label="ÉLECTEURS INSCRITS" value={stats.total_electeurs.toLocaleString('fr-FR')} sub="Liste électorale nationale" accent="#1565C0" />
        <StatCard label="VOTES EXPRIMÉS" value={stats.total_votes.toLocaleString('fr-FR')} sub="Résultats définitifs" accent="#007A3D" />
        <StatCard label="PARTICIPATION" value={`${stats.taux_participation}%`} sub="Taux national" accent="#FFC107" />
        <StatCard label="CANDIDATS" value={String(stats.total_candidats)} sub="En lice" accent="#CE1126" />
        <StatCard label="BUREAUX DE VOTE" value={stats.total_bureaux.toLocaleString('fr-FR')} sub="Répartis sur 10 régions" accent="#9C27B0" />
      </div>

      {/* MAIN GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* === LEFT: Candidates (like design 1 leaderboard) === */}
        <div style={{
          background: 'rgba(13, 31, 60, 0.8)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14, padding: '20px',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#E8ECF4', margin: 0 }}>
              Candidats — Classement National
            </h2>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['tous', '2h', '4h', '8h'] as const).map(t => (
                <button key={t} onClick={() => setActiveTab(t)} style={{
                  padding: '4px 10px',
                  background: activeTab === t ? '#1565C0' : 'transparent',
                  border: `1px solid ${activeTab === t ? '#1565C0' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 6, fontSize: 11, color: activeTab === t ? '#fff' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                }}>
                  {t === 'tous' ? 'Tout' : t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
            {CANDIDATS_MOCK.map((c, i) => (
              <CandidatCard key={c.id} candidat={c} rank={i} />
            ))}
          </div>
        </div>

        {/* === RIGHT: Pie + Line chart (like design 1 + design 2) === */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Gender chart */}
          <div style={{
            background: 'rgba(13, 31, 60, 0.8)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: '20px', flex: 1,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#E8ECF4', margin: '0 0 4px' }}>
                  Électeurs / Genre
                </h2>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Répartition nationale</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 12 }}>
              <PieChart width={110} height={110}>
                <Pie data={GENRE_DATA} cx={50} cy={50} innerRadius={30} outerRadius={50} dataKey="value" startAngle={90} endAngle={450}>
                  {GENRE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {GENRE_DATA.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color }} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{d.name}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#E8ECF4', marginLeft: 4 }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vote timeline line chart */}
          <div style={{
            background: 'rgba(13, 31, 60, 0.8)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: '20px', flex: 1,
          }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#E8ECF4', margin: '0 0 16px' }}>
              Votes Cumulés — Journée Électorale
            </h2>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={VOTE_TIMELINE}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="heure" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: '#0D1F3C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#E8ECF4', fontSize: 12 }}
                  formatter={(v: number) => [v.toLocaleString('fr-FR'), 'Votes']}
                />
                <Line type="monotone" dataKey="votes" stroke="#1565C0" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* MAP + RECAPITULATION (design 2 inspired) */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedRegion ? '1.2fr 1fr' : '1.2fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Map section */}
        <div style={{
          background: 'rgba(13, 31, 60, 0.8)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14, padding: '20px',
        }}>
          <div style={{ marginBottom: 12 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#E8ECF4', margin: '0 0 4px' }}>
              Carte Interactive — Participation par Région
            </h2>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
              Cliquez sur une région pour voir les détails
            </p>
          </div>
          <CameroonMap onRegionSelect={setSelectedRegion} selectedRegionId={selectedRegion?.region_id ?? null} />
        </div>

        {/* Right panel: either region detail or global recap */}
        <div style={{
          background: 'rgba(13, 31, 60, 0.8)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14, padding: '20px',
          overflow: 'hidden',
        }}>
          {selectedRegion ? (
            <div style={{ height: '100%' }}>
              <RegionPanel stats={selectedRegion} onClose={() => setSelectedRegion(null)} />
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#E8ECF4', margin: '0 0 4px' }}>
                  Récapitulation des Votes — National
                </h2>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                  Total exprimé: {stats.total_votes.toLocaleString('fr-FR')} votes
                </div>
              </div>

              {/* Candidate table like design 2 */}
              <div>
                <div style={{
                  display: 'grid', gridTemplateColumns: '32px 1fr auto',
                  padding: '0 0 6px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  marginBottom: 8,
                }}>
                  {['N°', 'Candidat / Parti', 'Total Votes'].map(h => (
                    <div key={h} style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
                      {h}
                    </div>
                  ))}
                </div>
                {stats.resultats_globaux.map((c, i) => (
                  <div key={c.candidat_id} style={{
                    display: 'grid', gridTemplateColumns: '32px 1fr auto',
                    padding: '10px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    alignItems: 'center',
                  }}>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <div style={{ fontSize: 12.5, color: '#E8ECF4', fontWeight: 600 }}>
                        {c.candidat_nom}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <div style={{
                          display: 'inline-block', padding: '1px 6px',
                          background: c.couleur + '22',
                          borderRadius: 4, fontSize: 10,
                          color: c.couleur, fontWeight: 600,
                        }}>{c.parti}</div>
                        <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${c.pourcentage}%`, background: c.couleur, borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 10, color: c.couleur, fontWeight: 700, minWidth: 30, textAlign: 'right' }}>
                          {c.pourcentage}%
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 12.5, fontWeight: 700, color: '#E8ECF4', paddingLeft: 12 }}>
                      {(c.votes / 1000).toFixed(0)}k
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Participation by region bar chart */}
      <div style={{
        background: 'rgba(13, 31, 60, 0.8)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14, padding: '20px',
      }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#E8ECF4', margin: '0 0 16px' }}>
          Participation par Région (%)
        </h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={PARTICIPATION_DATA} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <XAxis dataKey="region" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#0D1F3C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#E8ECF4' }}
              formatter={(v: number) => [`${v}%`, 'Participation']}
            />
            <Bar dataKey="participation" radius={[4, 4, 0, 0]}>
              {PARTICIPATION_DATA.map((d, i) => (
                <Cell key={i} fill={d.participation >= 60 ? '#007A3D' : d.participation >= 45 ? '#FF9800' : '#CE1126'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
