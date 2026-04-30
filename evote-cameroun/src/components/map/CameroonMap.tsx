'use client'

import { useState } from 'react'
import { REGIONS_STATS_MOCK, CANDIDATS_MOCK } from '@/lib/mock-data'
import { RegionStats } from '@/types'

// Simplified but recognizable SVG paths for Cameroon's 10 regions
// Coordinates are approximate, scaled to a 500x600 viewBox
const REGION_PATHS: Record<string, { path: string; labelX: number; labelY: number }> = {
  exn: {
    path: 'M 100,20 L 320,20 L 340,40 L 330,100 L 280,120 L 240,160 L 200,150 L 160,130 L 110,140 L 80,100 L 70,60 Z',
    labelX: 200, labelY: 85,
  },
  nor: {
    path: 'M 110,140 L 160,130 L 200,150 L 240,160 L 250,200 L 230,240 L 190,250 L 150,230 L 110,200 L 100,170 Z',
    labelX: 175, labelY: 195,
  },
  ada: {
    path: 'M 190,250 L 230,240 L 260,250 L 290,280 L 280,330 L 240,340 L 200,330 L 170,310 L 175,270 Z',
    labelX: 228, labelY: 295,
  },
  now: {
    path: 'M 70,280 L 120,260 L 160,270 L 170,310 L 150,350 L 100,360 L 65,340 L 55,310 Z',
    labelX: 110, labelY: 315,
  },
  oue: {
    path: 'M 160,270 L 200,260 L 230,280 L 240,310 L 220,340 L 190,350 L 160,340 L 150,310 L 160,285 Z',
    labelX: 195, labelY: 310,
  },
  lit: {
    path: 'M 90,350 L 140,345 L 160,360 L 165,395 L 140,420 L 100,410 L 75,385 L 80,360 Z',
    labelX: 120, labelY: 385,
  },
  sow: {
    path: 'M 55,360 L 90,350 L 100,380 L 90,420 L 60,430 L 35,410 L 38,380 Z',
    labelX: 65, labelY: 395,
  },
  cen: {
    path: 'M 200,330 L 260,320 L 310,340 L 320,380 L 300,420 L 260,430 L 220,420 L 190,395 L 185,360 L 200,340 Z',
    labelX: 252, labelY: 378,
  },
  est: {
    path: 'M 280,280 L 340,270 L 400,290 L 430,330 L 420,390 L 380,410 L 330,400 L 300,370 L 290,330 L 285,300 Z',
    labelX: 355, labelY: 340,
  },
  sud: {
    path: 'M 185,420 L 240,430 L 290,440 L 320,480 L 300,520 L 250,540 L 200,530 L 160,505 L 155,465 L 175,440 Z',
    labelX: 238, labelY: 480,
  },
}

const REGION_IDS: Record<string, string> = {
  exn: 'Extrême-Nord',
  nor: 'Nord',
  ada: 'Adamaoua',
  now: 'Nord-Ouest',
  oue: 'Ouest',
  lit: 'Littoral',
  sow: 'Sud-Ouest',
  cen: 'Centre',
  est: 'Est',
  sud: 'Sud',
}

function getParticipationColor(taux: number): string {
  if (taux >= 70) return '#1B5E20'
  if (taux >= 60) return '#2E7D32'
  if (taux >= 50) return '#388E3C'
  if (taux >= 40) return '#E65100'
  return '#B71C1C'
}

interface Props {
  onRegionSelect: (stats: RegionStats | null) => void
  selectedRegionId: string | null
}

export default function CameroonMap({ onRegionSelect, selectedRegionId }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const statsByRegion: Record<string, RegionStats> = {}
  REGIONS_STATS_MOCK.forEach(s => { statsByRegion[s.region_id] = s })

  function handleClick(regionId: string) {
    const stats = statsByRegion[regionId]
    if (!stats) return
    if (selectedRegionId === regionId) {
      onRegionSelect(null)
    } else {
      onRegionSelect(stats)
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
        {[
          { label: '≥70%', color: '#1B5E20' },
          { label: '60-70%', color: '#2E7D32' },
          { label: '50-60%', color: '#388E3C' },
          { label: '40-50%', color: '#E65100' },
          { label: '<40%', color: '#B71C1C' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: 'rgba(255,255,255,0.5)' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
            {l.label} participation
          </div>
        ))}
      </div>

      <svg
        viewBox="0 0 500 570"
        style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
        aria-label="Carte interactive des 10 régions du Cameroun"
      >
        {Object.entries(REGION_PATHS).map(([id, region]) => {
          const stats = statsByRegion[id]
          const isHovered = hoveredId === id
          const isSelected = selectedRegionId === id
          const fillColor = stats ? getParticipationColor(stats.taux_participation) : '#1E3056'

          return (
            <g key={id}>
              <path
                d={region.path}
                fill={isSelected ? '#1565C0' : isHovered ? `${fillColor}CC` : fillColor}
                stroke={isSelected ? '#90CAF9' : isHovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)'}
                strokeWidth={isSelected ? 2 : isHovered ? 1.5 : 0.8}
                style={{ transition: 'all 0.2s ease' }}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleClick(id)}
              />
              {/* Region label */}
              <text
                x={region.labelX}
                y={region.labelY}
                textAnchor="middle"
                fontSize={isHovered || isSelected ? 9 : 8}
                fontWeight={isSelected ? 700 : 600}
                fill="rgba(255,255,255,0.85)"
                style={{ pointerEvents: 'none', userSelect: 'none', letterSpacing: '0.02em' }}
              >
                {REGION_IDS[id].toUpperCase().split('-').map((part, i) => (
                  <tspan key={i} x={region.labelX} dy={i === 0 ? 0 : 9}>{part}</tspan>
                ))}
              </text>
              {/* Participation % */}
              {stats && (
                <text
                  x={region.labelX}
                  y={region.labelY + 14}
                  textAnchor="middle"
                  fontSize={8}
                  fill="rgba(255,255,255,0.55)"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {stats.taux_participation.toFixed(1)}%
                </text>
              )}
            </g>
          )
        })}

        {/* Atlantic Ocean label */}
        <text x="30" y="450" fontSize={7} fill="rgba(255,255,255,0.2)" style={{ userSelect: 'none' }}>
          GOLFE DE
        </text>
        <text x="30" y="460" fontSize={7} fill="rgba(255,255,255,0.2)" style={{ userSelect: 'none' }}>
          GUINÉE
        </text>

        {/* Nigeria border hint */}
        <text x="18" y="160" fontSize={6} fill="rgba(255,255,255,0.15)" style={{ userSelect: 'none', writingMode: 'vertical-rl' }}>
          NIGERIA
        </text>
      </svg>
    </div>
  )
}
