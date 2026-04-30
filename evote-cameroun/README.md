# E-Vote Cameroun 🇨🇲

> Plateforme de gestion électorale simulée pour la République du Cameroun  
> Stack: Next.js 14 + TypeScript + Tailwind CSS + Supabase

---

## 🚀 Installation Rapide

### Prérequis
- Node.js 18+ et npm/yarn
- Compte Supabase (gratuit sur supabase.com)

### 1. Cloner et installer

```bash
git clone <repo>
cd evote-cameroun
npm install
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Remplir `.env.local` avec vos clés Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 3. Configurer Supabase

#### a) Créer le projet Supabase
1. Aller sur https://app.supabase.com
2. Créer un nouveau projet
3. Copier l'URL et la Anon Key dans `.env.local`

#### b) Exécuter le schéma SQL
1. Dans Supabase → SQL Editor
2. Coller et exécuter le contenu de `supabase/schema.sql`
3. Vérifier que toutes les tables sont créées

#### c) Créer le compte admin
1. Supabase → Authentication → Users → Add User
2. Email: `admin@evote.cm`
3. Password: `admin123`
4. Retourner dans SQL Editor et exécuter:

```sql
DO $$
DECLARE
  admin_user_id UUID;
  admin_role_id UUID;
  region_cen_id UUID;
BEGIN
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@evote.cm';
  SELECT id INTO admin_role_id FROM public.roles WHERE nom = 'admin';
  SELECT id INTO region_cen_id FROM public.regions WHERE code = 'CEN';

  INSERT INTO public.users_profiles (id, nom, prenom, email, role_id, region_id, nationalite)
  VALUES (admin_user_id, 'ADMIN', 'Système', 'admin@evote.cm', admin_role_id, region_cen_id, 'Camerounaise')
  ON CONFLICT (id) DO UPDATE SET role_id = admin_role_id;
END $$;
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir http://localhost:3000

---

## 🔐 Accès Admin

| Champ | Valeur |
|-------|--------|
| Email | admin@evote.cm |
| Mot de passe | admin123 |

**Note démo**: En mode démo (sans Supabase configuré), ces identifiants fonctionnent directement.

---

## 📁 Structure du Projet

```
src/
├── app/
│   ├── auth/
│   │   ├── login/          # Page de connexion
│   │   └── register/       # Inscription agent (3 étapes)
│   ├── dashboard/
│   │   ├── page.tsx        # Dashboard principal
│   │   ├── layout.tsx      # Sidebar + layout
│   │   ├── electeurs/      # Gestion électeurs
│   │   ├── candidats/      # Gestion candidats
│   │   ├── bureaux/        # Bureaux de vote
│   │   └── votes/          # Simulation de votes
│   └── globals.css
├── components/
│   ├── map/
│   │   ├── CameroonMap.tsx  # SVG interactif 10 régions
│   │   └── RegionPanel.tsx  # Panneau détail région
│   ├── dashboard/          # Composants tableau de bord
│   └── ui/                 # Composants réutilisables
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Client navigateur
│   │   └── server.ts       # Client serveur
│   └── mock-data.ts        # Données de démonstration
├── types/index.ts          # Types TypeScript
└── middleware.ts           # Protection des routes
supabase/
└── schema.sql              # Schéma complet + RLS + seed
```

---

## 🗺️ Fonctionnalités

### Dashboard
- ✅ KPIs en temps réel (électeurs, votes, participation)
- ✅ Carte interactive SVG des 10 régions du Cameroun
- ✅ Panneau détail par région (clic sur la carte)
- ✅ Classement des candidats style leaderboard
- ✅ Récapitulation des votes style design 2
- ✅ Graphique timeline des votes journaliers
- ✅ Graphique participation par région
- ✅ Répartition par genre

### Authentification
- ✅ Login sécurisé avec validation
- ✅ Inscription en 3 étapes (conformes normes CENI)
- ✅ Protection des routes via middleware
- ✅ Gestion des sessions Supabase

### Enregistrement Électoral (Register)
Conforme au Code Electoral Camerounais (Loi N°2012/001):
- Étape 1: Identité (CNI, date naissance, lieu naissance, sexe)
- Étape 2: Accréditation CENI (rôle, région, numéro d'accréditation)
- Étape 3: Identifiants de connexion + consentement légal

---

## 🔒 Sécurité Supabase

- **RLS activé** sur toutes les tables
- **Policies granulaires** par rôle (admin, agent, superviseur, observateur)
- **Contrainte UNIQUE** sur les votes (un électeur = un vote)
- **Fonction sécurisée** `enregistrer_vote()` avec vérifications
- **Audit logs** pour toutes les opérations sensibles

---

## 🏗️ Déploiement

```bash
npm run build
npm start
```

Ou déployer sur Vercel:
```bash
npx vercel
```

Variables d'environnement à configurer dans Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## ⚖️ Base Légale

Ce système est conçu en référence à:
- Loi N°2012/001 du 19 Avril 2012 portant Code Electoral du Cameroun
- Décret N°2012/231 du 25 mai 2012
- Décret présidentiel n°76-172 du 20 Avril 1976 relatif à la carte nationale d'identité

---

*Développé pour la CENI — Commission Électorale Nationale Indépendante du Cameroun*
