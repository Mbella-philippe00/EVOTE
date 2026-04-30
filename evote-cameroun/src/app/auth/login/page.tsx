'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Demo: accept admin credentials
    if (email === 'admin@evote.cm' && password === 'admin123') {
      await new Promise(r => setTimeout(r, 800))
      router.push('/dashboard')
      return
    }

    // With real Supabase:
    // const supabase = createClient()
    // const { error } = await supabase.auth.signInWithPassword({ email, password })
    // if (error) { setError(error.message); setLoading(false); return }
    // router.push('/dashboard')

    await new Promise(r => setTimeout(r, 800))
    setError('Identifiants incorrects. Utilisez admin@evote.cm / admin123 pour la démo.')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', flexDirection: 'column' }}>
      {/* Cameroon flag top bar */}
      <div className="cm-flag-line" />

      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(13, 31, 60, 0.8)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Cameroon emblem placeholder */}
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'linear-gradient(135deg, #007A3D, #CE1126)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700, color: '#FCD116'
          }}>★</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#E8ECF4', letterSpacing: '0.05em' }}>
              ÉLECTIONS CAMEROUN
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em' }}>
              COMMISSION ÉLECTORALE NATIONALE INDÉPENDANTE
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'right' }}>
          <div>Plateforme Sécurisée E-Vote</div>
          <div style={{ color: 'rgba(255,255,255,0.2)' }}>v2.4.1 — SSL 256-bit</div>
        </div>
      </header>

      {/* Main */}
      <main style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px',
      }}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          {/* Title block */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(21, 101, 192, 0.12)',
              border: '1px solid rgba(21, 101, 192, 0.25)',
              borderRadius: 20, padding: '5px 14px', marginBottom: 16,
              fontSize: 11, color: '#90CAF9', letterSpacing: '0.08em', fontWeight: 600,
            }}>
              🔐 ACCÈS SÉCURISÉ — PERSONNEL AUTORISÉ
            </div>
            <h1 style={{
              fontSize: 26, fontWeight: 700, color: '#E8ECF4',
              margin: '0 0 8px', letterSpacing: '-0.02em',
            }}>
              Connexion au Système
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
              Réservé aux agents accrédités par la CENI
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: 'rgba(13, 31, 60, 0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: '36px',
          }}>
            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(206, 17, 38, 0.12)',
                border: '1px solid rgba(206, 17, 38, 0.3)',
                borderRadius: 8, padding: '12px 16px', marginBottom: 24,
                fontSize: 13, color: '#EF9A9A',
              }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8, letterSpacing: '0.06em' }}>
                  ADRESSE EMAIL INSTITUTIONNELLE
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="prenom.nom@evote.cm"
                  required
                  style={{
                    width: '100%', padding: '12px 16px',
                    borderRadius: 8, fontSize: 14,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#E8ECF4',
                  }}
                />
              </div>

              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em' }}>
                    MOT DE PASSE
                  </label>
                  <a href="#" style={{ fontSize: 12, color: '#90CAF9', textDecoration: 'none' }}>
                    Mot de passe oublié?
                  </a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%', padding: '12px 16px',
                    borderRadius: 8, fontSize: 14,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#E8ECF4',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '14px',
                  background: loading ? 'rgba(21, 101, 192, 0.5)' : '#1565C0',
                  color: '#fff', border: 'none', borderRadius: 8,
                  fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.04em', transition: 'all 0.2s',
                }}
              >
                {loading ? 'Authentification...' : 'SE CONNECTER'}
              </button>
            </form>

            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              marginTop: 28, paddingTop: 20,
              textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.35)',
            }}>
              Vous êtes un nouvel agent accrédité?{' '}
              <Link href="/auth/register" style={{ color: '#90CAF9', textDecoration: 'none', fontWeight: 600 }}>
                Créer votre compte
              </Link>
            </div>
          </div>

          {/* Info box */}
          <div style={{
            marginTop: 20, padding: '14px 16px',
            background: 'rgba(0, 122, 61, 0.08)',
            border: '1px solid rgba(0, 122, 61, 0.2)',
            borderRadius: 10, fontSize: 12,
            color: 'rgba(255,255,255,0.5)', lineHeight: 1.6,
          }}>
            <strong style={{ color: 'rgba(255,255,255,0.7)' }}>🛡️ Sécurité:</strong> Toutes les connexions sont chiffrées (TLS 1.3) et journalisées conformément au décret N°2012/231 du 25 mai 2012 portant organisation du Code Electoral du Cameroun.
          </div>

          {/* Demo credentials */}
          <div style={{
            marginTop: 12, padding: '12px 16px',
            background: 'rgba(255, 193, 7, 0.06)',
            border: '1px solid rgba(255, 193, 7, 0.15)',
            borderRadius: 10, fontSize: 12, color: 'rgba(255,255,255,0.45)',
          }}>
            <strong style={{ color: '#FFC107' }}>Démo:</strong> admin@evote.cm / admin123
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '16px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        fontSize: 11, color: 'rgba(255,255,255,0.25)',
      }}>
        © 2025 CENI Cameroun — Système E-Vote — Tous droits réservés
      </footer>
    </div>
  )
}
