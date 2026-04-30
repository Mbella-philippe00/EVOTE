import { DashboardStats, RegionStats } from '@/types'

export const REGIONS_CAMEROUN = [
  { id: 'ada', nom: 'Adamaoua', chef_lieu: 'Ngaoundéré', color: '#1565C0' },
  { id: 'cen', nom: 'Centre', chef_lieu: 'Yaoundé', color: '#2E7D32' },
  { id: 'est', nom: 'Est', chef_lieu: 'Bertoua', color: '#6A1B9A' },
  { id: 'exn', nom: 'Extrême-Nord', chef_lieu: 'Maroua', color: '#E65100' },
  { id: 'lit', nom: 'Littoral', chef_lieu: 'Douala', color: '#00838F' },
  { id: 'nor', nom: 'Nord', chef_lieu: 'Garoua', color: '#AD1457' },
  { id: 'now', nom: 'Nord-Ouest', chef_lieu: 'Bamenda', color: '#558B2F' },
  { id: 'oue', nom: 'Ouest', chef_lieu: 'Bafoussam', color: '#4527A0' },
  { id: 'sud', nom: 'Sud', chef_lieu: 'Ebolowa', color: '#00695C' },
  { id: 'sow', nom: 'Sud-Ouest', chef_lieu: 'Buea', color: '#C62828' },
]

export const CANDIDATS_MOCK = [
  { id: 'c1', nom: 'BIYA', prenom: 'Paul', parti: 'RDPC', sigle: 'RDPC', couleur: '#007A3D', votes: 1842350, pourcentage: 71.3 },
  { id: 'c2', nom: 'KAMTO', prenom: 'Maurice', parti: 'MRC', sigle: 'MRC', couleur: '#CE1126', votes: 465890, pourcentage: 18.0 },
  { id: 'c3', nom: 'MUNA', prenom: 'Akere', parti: 'CPP', sigle: 'CPP', couleur: '#1565C0', votes: 198430, pourcentage: 7.7 },
  { id: 'c4', nom: 'ABAH ABAH', prenom: 'Polycarpe', parti: 'ANDP', sigle: 'ANDP', couleur: '#FFC107', votes: 74120, pourcentage: 2.9 },
  { id: 'c5', nom: 'NDAM NJOYA', prenom: 'Adamou', parti: 'UDC', sigle: 'UDC', couleur: '#9C27B0', votes: 3210, pourcentage: 0.1 },
]

export const REGIONS_STATS_MOCK: RegionStats[] = [
  {
    region_id: 'cen', region_nom: 'Centre', total_electeurs: 980000, total_votes: 712540,
    taux_participation: 72.7,
    resultats_candidats: [
      { candidat_id: 'c1', candidat_nom: 'BIYA Paul', parti: 'RDPC', votes: 520000, pourcentage: 73.0 },
      { candidat_id: 'c2', candidat_nom: 'KAMTO Maurice', parti: 'MRC', votes: 145000, pourcentage: 20.4 },
    ]
  },
  {
    region_id: 'lit', region_nom: 'Littoral', total_electeurs: 1200000, total_votes: 840320,
    taux_participation: 70.0,
    resultats_candidats: [
      { candidat_id: 'c1', candidat_nom: 'BIYA Paul', parti: 'RDPC', votes: 560000, pourcentage: 66.6 },
      { candidat_id: 'c2', candidat_nom: 'KAMTO Maurice', parti: 'MRC', votes: 215000, pourcentage: 25.6 },
    ]
  },
  {
    region_id: 'exn', region_nom: 'Extrême-Nord', total_electeurs: 1450000, total_votes: 1050200,
    taux_participation: 72.4,
    resultats_candidats: [
      { candidat_id: 'c1', candidat_nom: 'BIYA Paul', parti: 'RDPC', votes: 895000, pourcentage: 85.2 },
      { candidat_id: 'c2', candidat_nom: 'KAMTO Maurice', parti: 'MRC', votes: 68000, pourcentage: 6.5 },
    ]
  },
  {
    region_id: 'oue', region_nom: 'Ouest', total_electeurs: 750000, total_votes: 510000,
    taux_participation: 68.0,
    resultats_candidats: [
      { candidat_id: 'c1', candidat_nom: 'BIYA Paul', parti: 'RDPC', votes: 285000, pourcentage: 55.9 },
      { candidat_id: 'c2', candidat_nom: 'KAMTO Maurice', parti: 'MRC', votes: 165000, pourcentage: 32.4 },
    ]
  },
  {
    region_id: 'nor', region_nom: 'Nord', total_electeurs: 580000, total_votes: 390000,
    taux_participation: 67.2,
    resultats_candidats: [
      { candidat_id: 'c1', candidat_nom: 'BIYA Paul', parti: 'RDPC', votes: 298000, pourcentage: 76.4 },
      { candidat_id: 'c2', candidat_nom: 'KAMTO Maurice', parti: 'MRC', votes: 48000, pourcentage: 12.3 },
    ]
  },
  {
    region_id: 'ada', region_nom: 'Adamaoua', total_electeurs: 420000, total_votes: 285000,
    taux_participation: 67.9,
    resultats_candidats: [
      { candidat_id: 'c1', candidat_nom: 'BIYA Paul', parti: 'RDPC', votes: 198000, pourcentage: 69.5 },
      { candidat_id: 'c2', candidat_nom: 'KAMTO Maurice', parti: 'MRC', votes: 52000, pourcentage: 18.2 },
    ]
  },
  {
    region_id: 'now', region_nom: 'Nord-Ouest', total_electeurs: 520000, total_votes: 241000,
    taux_participation: 46.3,
    resultats_candidats: [
      { candidat_id: 'c1', candidat_nom: 'BIYA Paul', parti: 'RDPC', votes: 98000, pourcentage: 40.7 },
      { candidat_id: 'c2', candidat_nom: 'KAMTO Maurice', parti: 'MRC', votes: 102000, pourcentage: 42.3 },
    ]
  },
  {
    region_id: 'sow', region_nom: 'Sud-Ouest', total_electeurs: 390000, total_votes: 162000,
    taux_participation: 41.5,
    resultats_candidats: [
      { candidat_id: 'c1', candidat_nom: 'BIYA Paul', parti: 'RDPC', votes: 72000, pourcentage: 44.4 },
      { candidat_id: 'c2', candidat_nom: 'KAMTO Maurice', parti: 'MRC', votes: 64000, pourcentage: 39.5 },
    ]
  },
  {
    region_id: 'est', region_nom: 'Est', total_electeurs: 340000, total_votes: 224000,
    taux_participation: 65.9,
    resultats_candidats: [
      { candidat_id: 'c1', candidat_nom: 'BIYA Paul', parti: 'RDPC', votes: 163000, pourcentage: 72.8 },
      { candidat_id: 'c2', candidat_nom: 'KAMTO Maurice', parti: 'MRC', votes: 40000, pourcentage: 17.9 },
    ]
  },
  {
    region_id: 'sud', region_nom: 'Sud', total_electeurs: 290000, total_votes: 169000,
    taux_participation: 58.3,
    resultats_candidats: [
      { candidat_id: 'c1', candidat_nom: 'BIYA Paul', parti: 'RDPC', votes: 110000, pourcentage: 65.1 },
      { candidat_id: 'c2', candidat_nom: 'KAMTO Maurice', parti: 'MRC', votes: 37000, pourcentage: 21.9 },
    ]
  },
]

export const DASHBOARD_STATS_MOCK: DashboardStats = {
  total_electeurs: 6920000,
  total_votes: 4584260,
  taux_participation: 66.2,
  total_candidats: 9,
  total_bureaux: 24567,
  regions_stats: REGIONS_STATS_MOCK,
  resultats_globaux: CANDIDATS_MOCK.map(c => ({
    candidat_id: c.id,
    candidat_nom: `${c.nom} ${c.prenom}`,
    parti: c.parti,
    couleur: c.couleur,
    votes: c.votes,
    pourcentage: c.pourcentage,
  }))
}
