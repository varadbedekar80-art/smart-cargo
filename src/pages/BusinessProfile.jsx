import { useEffect, useState } from 'react'

function BusinessProfile() {
  const [profile, setProfile] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    businessType: '',
    registrationNumber: '',
    address: '',
    city: '',
    country: 'India',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:5000/api/business-profile',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch business profile'
        )
      }

      setProfile({
        businessName: data.business_name || '',
        ownerName: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        businessType: data.business_type || '',
        registrationNumber:
          data.registration_number || '',
        address: data.address || '',
        city: data.city || '',
        country: data.country || 'India',
      })

    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    })

    setSaved(false)
    setError('')
  }

  const handleSave = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setSaved(false)
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:5000/api/business-profile',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            business_name: profile.businessName,
            phone: profile.phone,
            business_type: profile.businessType,
            registration_number:
              profile.registrationNumber,
            address: profile.address,
            city: profile.city,
            country: profile.country,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to update business profile'
        )
      }

      setSaved(true)

    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow-sm">
        <p className="text-slate-500">
          Loading business profile...
        </p>
      </div>
    )
  }

  return (
    <div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Business Profile
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your business information and account details.
        </p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          Business profile updated successfully.
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSave}>

        {/* Business Information */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-800">
            Business Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Basic information about your business.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Business Name
              </label>

              <input
                type="text"
                name="businessName"
                value={profile.businessName}
                onChange={handleChange}
                placeholder="Enter business name"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Owner Name
              </label>

              <input
                type="text"
                name="ownerName"
                value={profile.ownerName}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-slate-600 outline-none"
              />

              <p className="mt-1 text-xs text-slate-400">
                Account name from your user profile.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={profile.email}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-slate-600 outline-none"
              />

              <p className="mt-1 text-xs text-slate-400">
                Email is linked to your account.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Business Type
              </label>

              <select
                name="businessType"
                value={profile.businessType}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">
                  Select business type
                </option>
                <option value="Electronics Exporter">
                  Electronics Exporter
                </option>
                <option value="Textile Exporter">
                  Textile Exporter
                </option>
                <option value="Machinery Exporter">
                  Machinery Exporter
                </option>
                <option value="Food Exporter">
                  Food Exporter
                </option>
                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Registration Number
              </label>

              <input
                type="text"
                name="registrationNumber"
                value={profile.registrationNumber}
                onChange={handleChange}
                placeholder="Enter registration number"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

          </div>

        </div>

        {/* Address */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-800">
            Business Address
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Registered business location.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Address
              </label>

              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                placeholder="Enter business address"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                City
              </label>

              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Country
              </label>

              <input
                type="text"
                name="country"
                value={profile.country}
                onChange={handleChange}
                placeholder="Enter country"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

          </div>

        </div>

        {/* Account Status */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-800">
            Account Status
          </h2>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 p-4">

            <div>
              <p className="font-medium text-slate-800">
                Business Account
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Your business profile is active.
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
              Active
            </span>

          </div>

        </div>

        {/* Save Button */}
        <div className="flex justify-end">

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? 'Saving...'
              : 'Save Changes'}
          </button>

        </div>

      </form>

    </div>
  )
}

export default BusinessProfile
