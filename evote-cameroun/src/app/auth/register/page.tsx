'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const REGIONS = [
  'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral',
  'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest'
]

const ROLES = [
  { value: 'agent', label: 'Agent Électoral de Bureau de Vote' },
  { value: 'superviseur', label: 'Superviseur Régional' },
  { value: 'observateur', label: 'Observateur Electoral Indépendant' },
]

type Step = 1 | 2 | 3

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreed, setAgreed] = useState(false)

  const [form, setForm] = useState({
    // Step 1: Identité
    nom: '',
    prenom: '',
    date_naissance: '',
    lieu_naissance: '',
    sexe: '',
    nationalite: 'Camerounaise',
    numero_cni: '',
    // Step 2: Accréditation
    role: '',
    region_affectation: '',
    numero_accreditation: '',
    organisme_employeur: '',
    // Step 3: Compte
    email: '',
    password: '',
    confirm_password: '',
    telephone: '',
  })

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!agreed) { setError('Vous devez accepter les conditions d\'utilisation.'); return }
    if (form.password !== form.confirm_password) { setError('Les mots de passe ne correspondent pas.'); return }
    if (form.password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    // With real Supabase:
    // const supabase = createClient()
    // const { error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { nom: form.nom, prenom: form.prenom, role: form.role } } })
    router.push('/dashboard')
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 8, fontSize: 13.5,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#E8ECF4',
  } as React.CSSProperties

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 600,
    color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '0.06em'
  } as React.CSSProperties

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', flexDirection: 'column' }}>
      <div className="cm-flag-line" />

      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(13, 31, 60, 0.8)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, #007A3D, #CE1126)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: '#FCD116'
          }}>★</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#E8ECF4' }}>ÉLECTIONS CAMEROUN</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.07em' }}>COMMISSION ÉLECTORALE NATIONALE INDÉPENDANTE</div>
          </div>
        </div>
        <Link href="/auth/login" style={{ fontSize: 13, color: '#90CAF9', textDecoration: 'none' }}>
          ← Retour à la connexion
        </Link>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '36px 20px' }}>
        <div style={{ width: '100%', maxWidth: 600 }}>
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(0, 122, 61, 0.12)',
              border: '1px solid rgba(0, 122, 61, 0.25)',
              borderRadius: 20, padding: '5px 14px', marginBottom: 14,
              fontSize: 11, color: '#A5D6A7', letterSpacing: '0.08em', fontWeight: 600,
            }}>
              ENREGISTREMENT AGENT ÉLECTORAL — CENI 2025
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#E8ECF4', margin: '0 0 6px' }}>
              Création de Compte Agent
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              Conformément au Code Électoral du Cameroun (Loi N°2012/001 du 19 Avril 2012)
            </p>
          </div>

          {/* Steps indicator */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 30, gap: 0 }}>
            {[
              { n: 1, label: 'Identité' },
              { n: 2, label: 'Accréditation' },
              { n: 3, label: 'Compte' },
            ].map((s, i) => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: step >= s.n ? '#1565C0' : 'rgba(255,255,255,0.08)',
                    border: `2px solid ${step >= s.n ? '#1565C0' : 'rgba(255,255,255,0.12)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700,
                    color: step >= s.n ? '#fff' : 'rgba(255,255,255,0.3)',
                    transition: 'all 0.3s',
                  }}>
                    {step > s.n ? '✓' : s.n}
                  </div>
                  <div style={{ fontSize: 10, color: step >= s.n ? '#90CAF9' : 'rgba(255,255,255,0.3)', marginTop: 4, fontWeight: 600, letterSpacing: '0.04em' }}>
                    {s.label}
                  </div>
                </div>
                {i < 2 && (
                  <div style={{
                    height: 2, flex: 2, marginBottom: 18,
                    background: step > s.n ? '#1565C0' : 'rgba(255,255,255,0.08)',
                    transition: 'background 0.3s',
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Form card */}
          <div style={{
            background: 'rgba(13, 31, 60, 0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: '32px',
          }}>
            {error && (
              <div style={{
                background: 'rgba(206, 17, 38, 0.1)',
                border: '1px solid rgba(206, 17, 38, 0.25)',
                borderRadius: 8, padding: '10px 14px', marginBottom: 20,
                fontSize: 13, color: '#EF9A9A',
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* STEP 1: IDENTITÉ */}
            {step === 1 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#90CAF9', marginBottom: 20, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  🪪 Informations d&apos;Identité
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>NOM DE FAMILLE *</label>
                    <input type="text" style={inputStyle} value={form.nom} onChange={e => update('nom', e.target.value.toUpperCase())} placeholder="Ex: MBARGA" required />
                  </div>
                  <div>
                    <label style={labelStyle}>PRÉNOM(S) *</label>
                    <input type="text" style={inputStyle} value={form.prenom} onChange={e => update('prenom', e.target.value)} placeholder="Ex: Jean-Baptiste" required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                  <div>
                    <label style={labelStyle}>DATE DE NAISSANCE *</label>
                    <input type="date" style={inputStyle} value={form.date_naissance} onChange={e => update('date_naissance', e.target.value)} required />
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Doit avoir 18 ans minimum</div>
                  </div>
                  <div>
                    <label style={labelStyle}>LIEU DE NAISSANCE *</label>
                    <input type="text" style={inputStyle} value={form.lieu_naissance} onChange={e => update('lieu_naissance', e.target.value)} placeholder="Ex: Yaoundé" required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                  <div>
                    <label style={labelStyle}>SEXE *</label>
                    <select style={inputStyle} value={form.sexe} onChange={e => update('sexe', e.target.value)} required>
                      <option value="">Sélectionner</option>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>NATIONALITÉ *</label>
                    <select style={inputStyle} value={form.nationalite} onChange={e => update('nationalite', e.target.value)} required>
                      <option value="Camerounaise">Camerounaise</option>
                      <option value="Double nationalité">Double nationalité (avec Camerounaise)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <label style={labelStyle}>NUMÉRO CNI / CARTE D&apos;IDENTITÉ NATIONALE *</label>
                  <input type="text" style={inputStyle} value={form.numero_cni} onChange={e => update('numero_cni', e.target.value)} placeholder="Ex: 123456789" required />
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                    Obligatoire — Conformément au décret présidentiel n°76-172 du 20 Avril 1976
                  </div>
                </div>

                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!form.nom || !form.prenom || !form.date_naissance || !form.sexe || !form.numero_cni) {
                        setError('Veuillez remplir tous les champs obligatoires.')
                        return
                      }
                      setStep(2)
                      setError('')
                    }}
                    style={{
                      padding: '12px 28px',
                      background: '#1565C0', color: '#fff', border: 'none',
                      borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    Étape suivante →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ACCRÉDITATION */}
            {step === 2 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#90CAF9', marginBottom: 20, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  📋 Informations d&apos;Accréditation CENI
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>RÔLE / FONCTION *</label>
                  <select style={inputStyle} value={form.role} onChange={e => update('role', e.target.value)} required>
                    <option value="">Sélectionner votre fonction</option>
                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>RÉGION D&apos;AFFECTATION *</label>
                  <select style={inputStyle} value={form.region_affectation} onChange={e => update('region_affectation', e.target.value)} required>
                    <option value="">Sélectionner une région</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>NUMÉRO D&apos;ACCRÉDITATION CENI *</label>
                  <input type="text" style={inputStyle} value={form.numero_accreditation} onChange={e => update('numero_accreditation', e.target.value)} placeholder="Ex: CENI-2025-LIT-00342" required />
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                    Délivré par la CENI — Obligatoire pour tout personnel électoral
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>ORGANISME / INSTITUTION EMPLOYEUR *</label>
                  <input type="text" style={inputStyle} value={form.organisme_employeur} onChange={e => update('organisme_employeur', e.target.value)} placeholder="Ex: CENI, Observation Nationale, ONG..." required />
                </div>

                {/* Legal notice */}
                <div style={{
                  padding: '12px 14px',
                  background: 'rgba(0, 122, 61, 0.08)',
                  border: '1px solid rgba(0, 122, 61, 0.2)',
                  borderRadius: 8, fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7,
                  marginTop: 8,
                }}>
                  <strong style={{ color: 'rgba(255,255,255,0.65)' }}>⚖️ Base légale:</strong> L&apos;accréditation des agents électoraux est régie par la Loi N°2012/001 du 19 Avril 2012 portant Code Electoral du Cameroun, notamment ses articles 112 à 118 relatifs aux bureaux de vote.
                </div>

                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                  <button type="button" onClick={() => setStep(1)} style={{
                    padding: '12px 20px', background: 'transparent',
                    color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, fontSize: 14, cursor: 'pointer',
                  }}>
                    ← Retour
                  </button>
                  <button type="button"
                    onClick={() => {
                      if (!form.role || !form.region_affectation || !form.numero_accreditation) {
                        setError('Veuillez remplir tous les champs obligatoires.')
                        return
                      }
                      setStep(3)
                      setError('')
                    }}
                    style={{
                      padding: '12px 28px',
                      background: '#1565C0', color: '#fff', border: 'none',
                      borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    Étape suivante →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: COMPTE */}
            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#90CAF9', marginBottom: 20, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  🔐 Identifiants de Connexion
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>EMAIL INSTITUTIONNEL *</label>
                  <input type="email" style={inputStyle} value={form.email} onChange={e => update('email', e.target.value)} placeholder="prenom.nom@evote.cm" required />
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                    Utilisez votre email professionnel fourni par la CENI
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>TÉLÉPHONE PROFESSIONNEL</label>
                  <input type="tel" style={inputStyle} value={form.telephone} onChange={e => update('telephone', e.target.value)} placeholder="+237 6XX XXX XXX" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>MOT DE PASSE *</label>
                    <input type="password" style={inputStyle} value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min. 8 caractères" required minLength={8} />
                  </div>
                  <div>
                    <label style={labelStyle}>CONFIRMER *</label>
                    <input type="password" style={inputStyle} value={form.confirm_password} onChange={e => update('confirm_password', e.target.value)} placeholder="Répéter le mot de passe" required />
                  </div>
                </div>

                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 20, lineHeight: 1.7 }}>
                  Le mot de passe doit contenir: 8+ caractères, une majuscule, un chiffre, un caractère spécial.
                </div>

                {/* Consent */}
                <div style={{
                  padding: '14px',
                  background: 'rgba(21, 101, 192, 0.07)',
                  border: '1px solid rgba(21, 101, 192, 0.2)',
                  borderRadius: 8, marginBottom: 20,
                }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={e => setAgreed(e.target.checked)}
                      style={{ marginTop: 2, accentColor: '#1565C0' }}
                    />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                      Je certifie que les informations fournies sont exactes et je m&apos;engage à respecter le secret du vote, la neutralité et l&apos;impartialité conformément à la Loi N°2012/001 du Code Electoral du Cameroun. Toute fausse déclaration est passible de sanctions pénales.
                    </span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button type="button" onClick={() => setStep(2)} style={{
                    padding: '12px 20px', background: 'transparent',
                    color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, fontSize: 14, cursor: 'pointer',
                  }}>
                    ← Retour
                  </button>
                  <button type="submit" disabled={loading} style={{
                    padding: '12px 28px',
                    background: loading ? 'rgba(0, 122, 61, 0.4)' : '#007A3D',
                    color: '#fff', border: 'none',
                    borderRadius: 8, fontSize: 14, fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}>
                    {loading ? 'Création en cours...' : '✓ Créer Mon Compte'}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            Déjà accrédité?{' '}
            <Link href="/auth/login" style={{ color: '#90CAF9', textDecoration: 'none' }}>Se connecter</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
