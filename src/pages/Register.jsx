import { useState } from 'react'

function Register({ onBack, onRegisterSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Business User')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (!name || !email || !password) {
      setError('Please fill in all required fields.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        'https://smart-cargo.onrender.com/api/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Registration failed.')
        return
      }

      setSuccess(
        'Account created successfully. You can now login.'
      )

      setName('')
      setEmail('')
      setPassword('')
      setRole('Business User')

      setTimeout(() => {
        onRegisterSuccess()
      }, 1500)

    } catch (error) {
      console.error(error)

      setError(
        'Unable to connect to the backend. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <button
            onClick={onBack}
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">
              SC
            </div>

            <div className="text-left">
              <h1 className="font-bold text-slate-800">
                Smart Cargo
              </h1>

              <p className="text-xs text-slate-500">
                Export & Logistics
              </p>
            </div>

          </button>

          <button
            onClick={onBack}
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            ← Back to Login
          </button>

        </div>

      </nav>


      {/* Registration Section */}
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Card */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                SC
              </div>

              <h1 className="mt-5 text-2xl font-bold text-slate-800">
                Create Account
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Create your Smart Cargo account
              </p>

            </div>


            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* Name */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>


              {/* Email */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>


              {/* Password */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Minimum 6 characters
                </p>

              </div>


              {/* Role */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Account Type
                </label>

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                >

                  <option value="Business User">
                    Business User
                  </option>

                  <option value="Logistics Provider">
                    Logistics Provider
                  </option>

                </select>

              </div>


              {/* Error */}
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}


              {/* Success */}
              {success && (
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  {success}
                </div>
              )}


              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {loading
                  ? 'Creating Account...'
                  : 'Create Account'}
              </button>

            </form>


            {/* Login */}
            <p className="mt-6 text-center text-sm text-slate-500">

              Already have an account?{' '}

              <button
                type="button"
                onClick={onBack}
                className="font-medium text-blue-600 hover:underline"
              >
                Login
              </button>

            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Register