import { useEffect, useState } from 'react'

function AssignedShipments() {
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchShipments()
  }, [])

  const fetchShipments = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        'https://smart-cargo.onrender.com/api/provider/shipments',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch assigned shipments'
        )
      }

      setShipments(data)

    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-2xl font-bold text-slate-800">
          Assigned Shipments
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View shipments assigned to your logistics operation.
        </p>

      </div>


      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}


      {/* Loading */}
      {loading ? (

        <div className="rounded-xl bg-white p-10 text-center shadow-sm text-slate-500">
          Loading assigned shipments...
        </div>

      ) : shipments.length === 0 ? (

        <div className="rounded-xl bg-white p-10 text-center shadow-sm">

          <div className="text-4xl">
            🚚
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-800">
            No Assigned Shipments
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            There are currently no shipments assigned to you.
          </p>

        </div>

      ) : (

        <div className="rounded-xl bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">

            <h2 className="text-lg font-semibold text-slate-800">
              Shipment List
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Total shipments: {shipments.length}
            </p>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Shipment
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Tracking
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Route
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Method
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Provider
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {shipments.map((shipment) => (

                  <tr key={shipment.id}>

                    {/* Shipment */}
                    <td className="px-6 py-4">

                      <p className="font-medium text-slate-800">
                        {shipment.shipment_number}
                      </p>

                      {shipment.cargo_id && (
                        <p className="mt-1 text-xs text-slate-500">
                          Cargo ID: {shipment.cargo_id}
                        </p>
                      )}

                    </td>


                    {/* Tracking */}
                    <td className="px-6 py-4">

                      <p className="text-sm text-slate-600">
                        {shipment.tracking_number || 'Not available'}
                      </p>

                    </td>


                    {/* Route */}
                    <td className="px-6 py-4 text-sm text-slate-600">

                      <div>
                        {shipment.origin}
                      </div>

                      <div className="my-1 text-xs text-slate-400">
                        ↓
                      </div>

                      <div>
                        {shipment.destination}
                      </div>

                    </td>


                    {/* Method */}
                    <td className="px-6 py-4">

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        {shipment.shipping_method}
                      </span>

                    </td>


                    {/* Provider */}
                    <td className="px-6 py-4 text-sm text-slate-600">

                      {shipment.provider_name || 'Not assigned'}

                    </td>


                    {/* Status */}
                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          shipment.status === 'Completed' ||
                          shipment.status === 'Delivered'
                            ? 'bg-green-100 text-green-700'
                            : shipment.status === 'In Transit'
                              ? 'bg-blue-100 text-blue-700'
                              : shipment.status === 'Cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {shipment.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  )
}

export default AssignedShipments