import { useState } from 'react'

function Login({ onLogin, onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    if (!email || !password) {
      setError('Please enter email and password.')
      return
    }

    try {
      setLoading(true)

      const response = await fetch('https://smart-cargo.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed.')
        return
      }

      // Store authentication information
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Send the real role returned by the backend to App.jsx
      onLogin(data.user.role)

    } catch (error) {
      console.error(error)

      setError(
        'Unable to connect to the backend. Make sure the backend server is running.'
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
            ← Back to Website
          </button>

        </div>

      </nav>

      {/* Login Section */}
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Card */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                SC
              </div>

              <h1 className="mt-5 text-2xl font-bold text-slate-800">
                Welcome Back
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Login to your Smart Cargo account
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

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

                <div className="mb-2 flex justify-between">

                  <label className="block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() =>
                      alert('Password recovery will be connected later.')
                    }
                  >
                    Forgot Password?
                  </button>

                </div>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

            </form>

            {/* Backend Notice */}
            <div className="mt-6 rounded-lg bg-green-50 p-4 text-center text-sm text-green-700">
              Connected to Smart Cargo backend
            </div>

          </div>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-slate-500">

            Don't have an account?{' '}

            <button
              onClick={() =>
                alert('Registration page will be created next.')
              }
              className="font-medium text-blue-600 hover:underline"
            >
              Create an account
            </button>

          </p>

        </div>

      </div>

    </div>
  )
}

export default Login