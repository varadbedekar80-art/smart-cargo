import { useEffect, useState } from 'react'

function Providers() {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProviders = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        'https://smart-cargo.onrender.com/api/providers',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch providers'
        )
      }

      setProviders(data)
    } catch (error) {
      console.error(error)

      setError(
        error.message || 'Unable to load providers'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProviders()
  }, [])

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Logistics Providers
          </h1>

          <p className="text-slate-500 mt-1">
            View available logistics and transportation providers
          </p>
        </div>

      </div>


      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}


      {/* Loading */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-slate-500">
            Loading logistics providers...
          </p>
        </div>
      ) : providers.length === 0 ? (

        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-slate-500">
            No logistics providers available.
          </p>
        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {providers.map((provider) => (

            <div
              key={provider.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
            >

              {/* Provider Name */}
              <div className="flex items-start justify-between mb-5">

                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">
                      {provider.name.charAt(0)}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-800">
                      {provider.name}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {provider.service_type} Transport
                    </p>
                  </div>

                </div>

                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                  {provider.status}
                </span>

              </div>


              {/* Provider Details */}
              <div className="space-y-3 text-sm">

                <div>
                  <p className="text-slate-400">
                    Contact Email
                  </p>

                  <p className="text-slate-700">
                    {provider.contact_email || 'Not available'}
                  </p>
                </div>


                <div>
                  <p className="text-slate-400">
                    Contact Phone
                  </p>

                  <p className="text-slate-700">
                    {provider.contact_phone || 'Not available'}
                  </p>
                </div>


                <div>
                  <p className="text-slate-400">
                    Location
                  </p>

                  <p className="text-slate-700">
                    {provider.origin_location || 'Not available'}
                  </p>
                </div>


                <div>
                  <p className="text-slate-400">
                    Service Area
                  </p>

                  <p className="text-slate-700">
                    {provider.service_area || 'Not available'}
                  </p>
                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  )
}

export default Providers