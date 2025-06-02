'use client'

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: ''
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase
      .from('user') 
      .insert([
        {
          username: formData.username,
          firstname: formData.firstName,
          lastname: formData.lastName,
          password: formData.password // 🔐 À hasher côté serveur ou avec une edge function
        }
      ])

    if (error) {
      setError(error.message)
      setSuccess("")
    } else {
      setSuccess("Account created successfully!")
      setError("")
      setFormData({ firstName: '', lastName: '', username: '', password: '' })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">Join us today! Please fill in your details.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <div className="space-y-4">
            <Button type="submit" className="w-full">Create Account</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
