-- ================================================
-- E-VOTE CAMEROUN — SCHÉMA SUPABASE COMPLET
-- Exécuter dans l'éditeur SQL Supabase
-- ================================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. TABLES PRINCIPALES
-- ================================================

-- Régions du Cameroun
CREATE TABLE IF NOT EXISTS public.regions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  chef_lieu VARCHAR(100) NOT NULL,
  superficie_km2 INTEGER,
  population_electeurs INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rôles utilisateurs
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nom VARCHAR(50) UNIQUE NOT NULL, -- admin, agent, superviseur, observateur
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profils utilisateurs (liés à auth.users)
CREATE TABLE IF NOT EXISTS public.users_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telephone VARCHAR(20),
  role_id UUID REFERENCES public.roles(id),
  region_id UUID REFERENCES public.regions(id),
  numero_accreditation VARCHAR(100),
  organisme VARCHAR(200),
  sexe CHAR(1) CHECK (sexe IN ('M', 'F')),
  nationalite VARCHAR(100) DEFAULT 'Camerounaise',
  numero_cni VARCHAR(50),
  date_naissance DATE,
  lieu_naissance VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bureaux de vote
CREATE TABLE IF NOT EXISTS public.bureaux_vote (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nom VARCHAR(200) NOT NULL,
  adresse TEXT NOT NULL,
  region_id UUID REFERENCES public.regions(id) NOT NULL,
  code_bureau VARCHAR(50) UNIQUE NOT NULL,
  capacite_max INTEGER DEFAULT 500,
  nombre_inscrits INTEGER DEFAULT 0,
  nombre_votes INTEGER DEFAULT 0,
  longitude DECIMAL(10, 7),
  latitude DECIMAL(10, 7),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Électeurs
CREATE TABLE IF NOT EXISTS public.electeurs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  numero_carte_electeur VARCHAR(50) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  date_naissance DATE NOT NULL,
  lieu_naissance VARCHAR(100) NOT NULL,
  sexe CHAR(1) NOT NULL CHECK (sexe IN ('M', 'F')),
  nationalite VARCHAR(100) DEFAULT 'Camerounaise',
  profession VARCHAR(100),
  adresse TEXT,
  region_id UUID REFERENCES public.regions(id) NOT NULL,
  bureau_vote_id UUID REFERENCES public.bureaux_vote(id) NOT NULL,
  a_vote BOOLEAN DEFAULT FALSE,
  date_vote TIMESTAMPTZ,
  date_inscription DATE DEFAULT CURRENT_DATE,
  photo_url TEXT,
  numero_cni VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidats
CREATE TABLE IF NOT EXISTS public.candidats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  date_naissance DATE,
  parti_politique VARCHAR(200) NOT NULL,
  sigle_parti VARCHAR(20) NOT NULL,
  couleur_parti VARCHAR(20) DEFAULT '#1565C0',
  photo_url TEXT,
  numero_ordre SMALLINT UNIQUE NOT NULL,
  programme TEXT,
  region_origine_id UUID REFERENCES public.regions(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  electeur_id UUID REFERENCES public.electeurs(id) NOT NULL,
  candidat_id UUID REFERENCES public.candidats(id) NOT NULL,
  bureau_vote_id UUID REFERENCES public.bureaux_vote(id) NOT NULL,
  region_id UUID REFERENCES public.regions(id) NOT NULL,
  date_vote TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Contrainte: un électeur ne peut voter qu'une seule fois
  CONSTRAINT unique_vote_per_electeur UNIQUE (electeur_id)
);

-- Logs d'audit
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 2. INDEX POUR LES PERFORMANCES
-- ================================================

CREATE INDEX IF NOT EXISTS idx_electeurs_region ON public.electeurs(region_id);
CREATE INDEX IF NOT EXISTS idx_electeurs_bureau ON public.electeurs(bureau_vote_id);
CREATE INDEX IF NOT EXISTS idx_electeurs_a_vote ON public.electeurs(a_vote);
CREATE INDEX IF NOT EXISTS idx_votes_candidat ON public.votes(candidat_id);
CREATE INDEX IF NOT EXISTS idx_votes_region ON public.votes(region_id);
CREATE INDEX IF NOT EXISTS idx_votes_bureau ON public.votes(bureau_vote_id);
CREATE INDEX IF NOT EXISTS idx_votes_date ON public.votes(date_vote);
CREATE INDEX IF NOT EXISTS idx_bureaux_region ON public.bureaux_vote(region_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON public.audit_logs(user_id);

-- ================================================
-- 3. ROW LEVEL SECURITY
-- ================================================

ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electeurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bureaux_vote ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS VARCHAR AS $$
  SELECT r.nom FROM public.users_profiles up
  JOIN public.roles r ON up.role_id = r.id
  WHERE up.id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function: is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT public.get_user_role(auth.uid()) = 'admin';
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- POLICIES: Regions (public read, admin write)
CREATE POLICY "regions_select" ON public.regions FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "regions_admin_all" ON public.regions FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- POLICIES: Roles (public read, admin write)
CREATE POLICY "roles_select" ON public.roles FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "roles_admin_all" ON public.roles FOR ALL TO authenticated USING (public.is_admin());

-- POLICIES: Users profiles
CREATE POLICY "profiles_select_own" ON public.users_profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "profiles_insert_own" ON public.users_profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_own" ON public.users_profiles FOR UPDATE TO authenticated USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "profiles_admin_all" ON public.users_profiles FOR DELETE TO authenticated USING (public.is_admin());

-- POLICIES: Electeurs (agents read, admin all)
CREATE POLICY "electeurs_select" ON public.electeurs FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "electeurs_insert" ON public.electeurs FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.get_user_role(auth.uid()) = 'agent');
CREATE POLICY "electeurs_update" ON public.electeurs FOR UPDATE TO authenticated USING (public.is_admin() OR public.get_user_role(auth.uid()) = 'agent');
CREATE POLICY "electeurs_delete" ON public.electeurs FOR DELETE TO authenticated USING (public.is_admin());

-- POLICIES: Candidats
CREATE POLICY "candidats_select" ON public.candidats FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "candidats_admin_all" ON public.candidats FOR ALL TO authenticated USING (public.is_admin());

-- POLICIES: Bureaux
CREATE POLICY "bureaux_select" ON public.bureaux_vote FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "bureaux_admin_all" ON public.bureaux_vote FOR ALL TO authenticated USING (public.is_admin());

-- POLICIES: Votes (insert by agents, read by all auth, delete/admin only)
CREATE POLICY "votes_select" ON public.votes FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "votes_insert" ON public.votes FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.electeurs e WHERE e.id = electeur_id AND e.a_vote = FALSE)
);
CREATE POLICY "votes_admin_delete" ON public.votes FOR DELETE TO authenticated USING (public.is_admin());

-- POLICIES: Audit
CREATE POLICY "audit_admin_all" ON public.audit_logs FOR ALL TO authenticated USING (public.is_admin());

-- ================================================
-- 4. DONNÉES INITIALES — RÉGIONS DU CAMEROUN
-- ================================================

INSERT INTO public.regions (code, nom, chef_lieu, superficie_km2, population_electeurs) VALUES
  ('ADA', 'Adamaoua', 'Ngaoundéré', 63701, 420000),
  ('CEN', 'Centre', 'Yaoundé', 68953, 980000),
  ('EST', 'Est', 'Bertoua', 109011, 340000),
  ('EXN', 'Extrême-Nord', 'Maroua', 34246, 1450000),
  ('LIT', 'Littoral', 'Douala', 20239, 1200000),
  ('NOR', 'Nord', 'Garoua', 66090, 580000),
  ('NOW', 'Nord-Ouest', 'Bamenda', 17300, 520000),
  ('OUE', 'Ouest', 'Bafoussam', 13892, 750000),
  ('SUD', 'Sud', 'Ebolowa', 47110, 290000),
  ('SOW', 'Sud-Ouest', 'Buea', 25410, 390000)
ON CONFLICT (code) DO NOTHING;

-- ================================================
-- 5. RÔLES UTILISATEURS
-- ================================================

INSERT INTO public.roles (nom, permissions) VALUES
  ('admin', '{"all": true, "electeurs": true, "candidats": true, "votes": true, "bureaux": true, "rapports": true}'::JSONB),
  ('agent', '{"electeurs": ["read","create","update"], "votes": ["create"], "bureaux": ["read"]}'::JSONB),
  ('superviseur', '{"electeurs": ["read"], "votes": ["read"], "bureaux": ["read","update"], "rapports": ["read"]}'::JSONB),
  ('observateur', '{"electeurs": ["read"], "votes": ["read"], "candidats": ["read"]}'::JSONB)
ON CONFLICT (nom) DO NOTHING;

-- ================================================
-- 6. CANDIDATS PRÉSIDENTIELS 2025
-- ================================================

INSERT INTO public.candidats (nom, prenom, parti_politique, sigle_parti, couleur_parti, numero_ordre) VALUES
  ('BIYA', 'Paul', 'Rassemblement Démocratique du Peuple Camerounais', 'RDPC', '#007A3D', 1),
  ('KAMTO', 'Maurice', 'Mouvement pour la Renaissance du Cameroun', 'MRC', '#CE1126', 2),
  ('MUNA', 'Akere', 'Cameroon People''s Party', 'CPP', '#1565C0', 3),
  ('ABAH ABAH', 'Polycarpe', 'Alliance Nationale pour la Démocratie et le Progrès', 'ANDP', '#FFC107', 4),
  ('NDAM NJOYA', 'Adamou', 'Union Démocratique du Cameroun', 'UDC', '#9C27B0', 5),
  ('DADJI', 'Garga Haman', 'Alliance pour la Démocratie et le Développement', 'ADD', '#FF5722', 6),
  ('TCHAPDA', 'Cabral Libii', 'Univers', 'UNIVERS', '#00BCD4', 7),
  ('ELONG MBASSI', 'Jean Pierre', 'Mouvement Populaire pour le Dialogue', 'MPD', '#795548', 8),
  ('AYISSI', 'Serge', 'Mouvement Africain pour la Nouvelle Indépendance', 'MANI', '#607D8B', 9)
ON CONFLICT (numero_ordre) DO NOTHING;

-- ================================================
-- 7. ADMIN PAR DÉFAUT (À EXÉCUTER APRÈS CRÉATION COMPTE)
-- ================================================
-- Étape 1: Créer le compte via Supabase Auth Dashboard ou l'API:
--   Email: admin@evote.cm
--   Password: admin123
--
-- Étape 2: Exécuter ce script après création pour assigner le rôle admin:

/*
DO $$
DECLARE
  admin_user_id UUID;
  admin_role_id UUID;
  region_cen_id UUID;
BEGIN
  -- Récupérer l'ID de l'utilisateur admin
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@evote.cm';
  SELECT id INTO admin_role_id FROM public.roles WHERE nom = 'admin';
  SELECT id INTO region_cen_id FROM public.regions WHERE code = 'CEN';

  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.users_profiles (id, nom, prenom, email, role_id, region_id, nationalite)
    VALUES (admin_user_id, 'ADMIN', 'Système', 'admin@evote.cm', admin_role_id, region_cen_id, 'Camerounaise')
    ON CONFLICT (id) DO UPDATE SET role_id = admin_role_id;
    
    RAISE NOTICE 'Admin profile created/updated for user: %', admin_user_id;
  ELSE
    RAISE NOTICE 'Admin user not found. Create account first via Auth.';
  END IF;
END $$;
*/

-- ================================================
-- 8. VUES UTILES POUR LE DASHBOARD
-- ================================================

-- Vue: statistiques par région
CREATE OR REPLACE VIEW public.v_stats_regions AS
SELECT
  r.id AS region_id,
  r.nom AS region_nom,
  r.code AS region_code,
  r.chef_lieu,
  r.population_electeurs AS total_electeurs,
  COUNT(DISTINCT e.id) AS electeurs_inscrits,
  COUNT(DISTINCT v.id) AS total_votes,
  CASE 
    WHEN COUNT(DISTINCT e.id) > 0 
    THEN ROUND(COUNT(DISTINCT v.id)::NUMERIC / COUNT(DISTINCT e.id) * 100, 2)
    ELSE 0 
  END AS taux_participation
FROM public.regions r
LEFT JOIN public.electeurs e ON e.region_id = r.id
LEFT JOIN public.votes v ON v.region_id = r.id
GROUP BY r.id, r.nom, r.code, r.chef_lieu, r.population_electeurs;

-- Vue: résultats par candidat
CREATE OR REPLACE VIEW public.v_resultats_candidats AS
SELECT
  c.id AS candidat_id,
  c.nom || ' ' || c.prenom AS candidat_nom,
  c.parti_politique AS parti,
  c.sigle_parti AS sigle,
  c.couleur_parti AS couleur,
  c.numero_ordre,
  COUNT(v.id) AS total_votes,
  CASE 
    WHEN (SELECT COUNT(*) FROM public.votes) > 0
    THEN ROUND(COUNT(v.id)::NUMERIC / (SELECT COUNT(*) FROM public.votes) * 100, 2)
    ELSE 0
  END AS pourcentage
FROM public.candidats c
LEFT JOIN public.votes v ON v.candidat_id = c.id
WHERE c.is_active = TRUE
GROUP BY c.id, c.nom, c.prenom, c.parti_politique, c.sigle_parti, c.couleur_parti, c.numero_ordre
ORDER BY total_votes DESC;

-- Vue: dashboard global
CREATE OR REPLACE VIEW public.v_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM public.electeurs) AS total_electeurs,
  (SELECT COUNT(*) FROM public.votes) AS total_votes,
  (SELECT COUNT(*) FROM public.candidats WHERE is_active = TRUE) AS total_candidats,
  (SELECT COUNT(*) FROM public.bureaux_vote WHERE is_active = TRUE) AS total_bureaux,
  CASE 
    WHEN (SELECT COUNT(*) FROM public.electeurs) > 0
    THEN ROUND((SELECT COUNT(*) FROM public.votes)::NUMERIC / (SELECT COUNT(*) FROM public.electeurs) * 100, 2)
    ELSE 0
  END AS taux_participation_national;

-- ================================================
-- 9. FONCTIONS UTILITAIRES
-- ================================================

-- Fonction: enregistrer un vote
CREATE OR REPLACE FUNCTION public.enregistrer_vote(
  p_electeur_id UUID,
  p_candidat_id UUID,
  p_bureau_vote_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_electeur public.electeurs%ROWTYPE;
  v_region_id UUID;
  v_vote_id UUID;
BEGIN
  -- Vérifier que l'électeur existe
  SELECT * INTO v_electeur FROM public.electeurs WHERE id = p_electeur_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', FALSE, 'message', 'Électeur introuvable');
  END IF;
  
  -- Vérifier que l'électeur n'a pas encore voté
  IF v_electeur.a_vote THEN
    RETURN json_build_object('success', FALSE, 'message', 'Cet électeur a déjà voté');
  END IF;
  
  -- Récupérer la région du bureau de vote
  SELECT region_id INTO v_region_id FROM public.bureaux_vote WHERE id = p_bureau_vote_id;
  
  -- Insérer le vote
  INSERT INTO public.votes (electeur_id, candidat_id, bureau_vote_id, region_id)
  VALUES (p_electeur_id, p_candidat_id, p_bureau_vote_id, v_region_id)
  RETURNING id INTO v_vote_id;
  
  -- Marquer l'électeur comme ayant voté
  UPDATE public.electeurs 
  SET a_vote = TRUE, date_vote = NOW(), updated_at = NOW()
  WHERE id = p_electeur_id;
  
  -- Incrémenter le compteur du bureau
  UPDATE public.bureaux_vote
  SET nombre_votes = nombre_votes + 1
  WHERE id = p_bureau_vote_id;
  
  RETURN json_build_object('success', TRUE, 'vote_id', v_vote_id, 'message', 'Vote enregistré avec succès');
  
EXCEPTION WHEN unique_violation THEN
  RETURN json_build_object('success', FALSE, 'message', 'Violation de contrainte: vote déjà enregistré');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- FIN DU SCHÉMA
-- Auteur: E-Vote Cameroun — CENI 2025
-- ================================================
