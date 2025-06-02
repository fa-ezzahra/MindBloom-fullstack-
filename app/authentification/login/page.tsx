'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')  // nouvel état message succès
  const supabase = createClientComponentClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const { data: user, error: fetchError } = await supabase
        .from('user')
        .select('username, password')
        .eq('username', username)
        .single()

      if (fetchError || !user) {
        setError('Invalid username or password')
        return
      }

      if (password !== user.password) {
        setError('Invalid username or password')
        return
      }

      // Auth OK => afficher message succès
      setSuccess(`Bienvenue ${user.username} ! Connexion réussie.`)
    } catch (err) {
      console.error(err)
      setError('Unexpected error. Try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sign in</h1>
          <p className="text-sm text-gray-600">Use your username and password</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}
