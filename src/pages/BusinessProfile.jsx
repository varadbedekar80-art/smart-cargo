import { useState } from 'react'

function BusinessProfile() {
  const [profile, setProfile] = useState({
    businessName: 'ABC Electronics Pvt. Ltd.',
    ownerName: 'Rahul Sharma',
    email: 'rahul@abcelectronics.com',
    phone: '+91 98765 43210',
    businessType: 'Electronics Exporter',
    registrationNumber: 'U12345MH2026PTC001',
    address: 'Andheri East, Mumbai',
    city: 'Mumbai',
    country: 'India',
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    })

    setSaved(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
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
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
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
                <option>Electronics Exporter</option>
                <option>Textile Exporter</option>
                <option>Machinery Exporter</option>
                <option>Food Exporter</option>
                <option>Other</option>
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
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Save Changes
          </button>

        </div>

      </form>

    </div>
  )
}

export default BusinessProfile