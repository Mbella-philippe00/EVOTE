export type Region = {
  id: string
  nom: string
  chef_lieu: string
  superficie_km2: number
  population_electeurs: number
  created_at: string
}

export type Electeur = {
  id: string
  numero_carte_electeur: string
  nom: string
  prenom: string
  date_naissance: string
  lieu_naissance: string
  sexe: 'M' | 'F'
  nationalite: string
  profession: string
  adresse: string
  region_id: string
  bureau_vote_id: string
  a_vote: boolean
  date_inscription: string
  created_at: string
  region?: Region
  bureau_vote?: BureauVote
}

export type Candidat = {
  id: string
  nom: string
  prenom: string
  parti_politique: string
  sigle_parti: string
  couleur_parti: string
  photo_url?: string
  numero_ordre: number
  programme?: string
  region_origine?: string
  created_at: string
}

export type BureauVote = {
  id: string
  nom: string
  adresse: string
  region_id: string
  capacite_max: number
  nombre_inscrits: number
  nombre_votes: number
  created_at: string
  region?: Region
}

export type Vote = {
  id: string
  electeur_id: string
  candidat_id: string
  bureau_vote_id: string
  region_id: string
  date_vote: string
  created_at: string
}

export type RegionStats = {
  region_id: string
  region_nom: string
  total_electeurs: number
  total_votes: number
  taux_participation: number
  resultats_candidats: { candidat_id: string; candidat_nom: string; parti: string; votes: number; pourcentage: number }[]
}

export type DashboardStats = {
  total_electeurs: number
  total_votes: number
  taux_participation: number
  total_candidats: number
  total_bureaux: number
  regions_stats: RegionStats[]
  resultats_globaux: { candidat_id: string; candidat_nom: string; parti: string; couleur: string; votes: number; pourcentage: number }[]
}

export type UserRole = 'admin' | 'agent' | 'observateur'

export type AppUser = {
  id: string
  email: string
  nom: string
  prenom: string
  role: UserRole
  region_id?: string
  created_at: string
}
