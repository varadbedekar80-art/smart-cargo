import { useEffect, useState } from 'react'

function Businesses() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  const fetchBusinesses = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        'https://smart-cargo.onrender.com/api/admin/businesses',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const contentType = response.headers.get('content-type') || ''

      if (!contentType.includes('application/json')) {
        throw new Error(
          'Server returned an invalid response. Please try again after deployment.'
        )
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load businesses'
        )
      }

      setBusinesses(data)

    } catch (error) {
      console.error('GET BUSINESSES ERROR:', error)

      setError(
        error.message || 'Failed to load businesses'
      )

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const activeBusinesses = businesses.filter(
    (business) => business.status === 'Active'
  ).length

  const inactiveBusinesses = businesses.filter(
    (business) => business.status === 'Inactive'
  ).length

  return (
    <div className="p-6">

      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Businesses
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage registered business profiles and their owners.
        </p>
      </div>


      {/* SUMMARY CARDS */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Businesses
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {businesses.length}
          </p>
        </div>


        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Active Businesses
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {activeBusinesses}
          </p>
        </div>


        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Inactive Businesses
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {inactiveBusinesses}
          </p>
        </div>

      </div>


      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}


      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="font-semibold text-gray-900">
            Registered Businesses
          </h2>
        </div>


        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading businesses...
          </div>
        ) : businesses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No business profiles found.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-gray-50">
                <tr>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Business
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Owner
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Business Type
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Location
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                </tr>
              </thead>


              <tbody className="divide-y divide-gray-200">

                {businesses.map((business) => (
                  <tr
                    key={business.id}
                    className="hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {business.business_name || 'Not provided'}
                      </div>

                      <div className="text-sm text-gray-500">
                        {business.registration_number || 'No registration number'}
                      </div>
                    </td>


                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {business.owner_name}
                      </div>

                      <div className="text-sm text-gray-500">
                        {business.owner_email}
                      </div>
                    </td>


                    <td className="px-6 py-4 text-sm text-gray-700">
                      {business.business_type || 'Not provided'}
                    </td>


                    <td className="px-6 py-4 text-sm text-gray-700">
                      {business.city || 'Not provided'}
                      {business.country
                        ? `, ${business.country}`
                        : ''}
                    </td>


                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          business.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {business.status}
                      </span>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  )
}

export default Businesses