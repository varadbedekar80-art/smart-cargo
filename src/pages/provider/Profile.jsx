import { useEffect, useState } from 'react'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
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
        'https://smart-cargo.onrender.com/api/provider/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load provider profile'
        )
      }

      setProfile(data)

    } catch (error) {
      console.error('PROVIDER PROFILE ERROR:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">
            Loading provider profile...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Unable to load profile
          </h2>

          <p className="text-gray-600">
            {error}
          </p>

          <button
            onClick={fetchProfile}
            className="mt-5 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="p-8">

      {/* Page Header */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Provider Profile
        </h1>

        <p className="text-gray-500 mt-1">
          View your logistics provider account information.
        </p>

      </div>


      {/* Profile Layout */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


        {/* Profile Summary */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

          <div className="flex flex-col items-center text-center">

            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">

              <span className="text-3xl font-bold text-blue-600">
                {profile.name
                  ? profile.name.charAt(0).toUpperCase()
                  : 'P'}
              </span>

            </div>


            <h2 className="text-xl font-bold text-gray-800">
              {profile.name}
            </h2>


            <p className="text-gray-500 mt-1">
              {profile.service_type}
            </p>


            <span
              className={`mt-4 px-4 py-1.5 rounded-full text-sm font-medium ${
                profile.status === 'Active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {profile.status}
            </span>

          </div>

        </div>


        {/* Provider Information */}

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Provider Information
          </h2>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


            {/* Provider Name */}

            <div>

              <p className="text-sm text-gray-500 mb-1">
                Provider Name
              </p>

              <p className="font-medium text-gray-800">
                {profile.name || 'Not available'}
              </p>

            </div>


            {/* Service Type */}

            <div>

              <p className="text-sm text-gray-500 mb-1">
                Service Type
              </p>

              <p className="font-medium text-gray-800">
                {profile.service_type || 'Not available'}
              </p>

            </div>


            {/* Contact Email */}

            <div>

              <p className="text-sm text-gray-500 mb-1">
                Contact Email
              </p>

              <p className="font-medium text-gray-800">
                {profile.contact_email || 'Not available'}
              </p>

            </div>


            {/* Contact Phone */}

            <div>

              <p className="text-sm text-gray-500 mb-1">
                Contact Phone
              </p>

              <p className="font-medium text-gray-800">
                {profile.contact_phone || 'Not available'}
              </p>

            </div>


            {/* Origin Location */}

            <div>

              <p className="text-sm text-gray-500 mb-1">
                Origin Location
              </p>

              <p className="font-medium text-gray-800">
                {profile.origin_location || 'Not available'}
              </p>

            </div>


            {/* Service Area */}

            <div>

              <p className="text-sm text-gray-500 mb-1">
                Service Area
              </p>

              <p className="font-medium text-gray-800">
                {profile.service_area || 'Not available'}
              </p>

            </div>

          </div>

        </div>


        {/* Account Information */}

        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Account Information
          </h2>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


            {/* Account Name */}

            <div>

              <p className="text-sm text-gray-500 mb-1">
                Account Name
              </p>

              <p className="font-medium text-gray-800">
                {profile.account_name || 'Not available'}
              </p>

            </div>


            {/* Account Email */}

            <div>

              <p className="text-sm text-gray-500 mb-1">
                Account Email
              </p>

              <p className="font-medium text-gray-800">
                {profile.account_email || 'Not available'}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Profile

