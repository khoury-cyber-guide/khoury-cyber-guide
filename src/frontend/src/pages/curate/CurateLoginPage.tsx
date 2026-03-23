import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '@/hooks/useAdminAuth'

export function CurateLoginPage() {
  const { login } = useAdminAuth()
  const navigate = useNavigate()
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token.trim()) return
    setError('')
    setLoading(true)
    try {
      await login(token.trim())
      navigate('/curate/dashboard', { replace: true })
    } catch {
      setError('Invalid token. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest text-carmine">CURATE KHOURY CYBER</p>
          <h1 className="mt-2 text-2xl font-bold text-alabaster">Sign in</h1>
          <p className="mt-1 text-sm text-dim-grey">Enter your personal access token to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="token" className="text-xs font-semibold text-dim-grey">
              Access token
            </label>
            <input
              id="token"
              type="password"
              autoComplete="current-password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your token here"
              className="rounded border border-white/15 bg-graphite px-3 py-2.5 text-sm text-alabaster placeholder:text-dim-grey/50 focus:border-carmine/60 focus:outline-none"
              required
            />
          </div>

          {error && (
            <p role="alert" className="text-xs text-carmine">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="rounded bg-carmine px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Verifying…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
