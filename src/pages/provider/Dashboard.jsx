import { useEffect, useState } from 'react'

function ProviderDashboard() {
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
          data.message || 'Failed to fetch shipments'
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

  const pendingShipments = shipments.filter(
    (shipment) => shipment.status === 'Pending'
  ).length

  const activeShipments = shipments.filter(
    (shipment) =>
      shipment.status === 'In Transit' ||
      shipment.status === 'Picked Up'
  ).length

  const completedShipments = shipments.filter(
    (shipment) =>
      shipment.status === 'Completed' ||
      shipment.status === 'Delivered'
  ).length

  return (
    <div>

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-2xl font-bold text-slate-800">
          Logistics Provider Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your assigned shipments and delivery operations.
        </p>

      </div>


      {/* Welcome */}
      <div className="mb-8 rounded-2xl bg-blue-600 p-6 text-white">

        <h2 className="text-2xl font-bold">
          Welcome, Logistics Provider
        </h2>

        <p className="mt-2 text-blue-100">
          View assigned shipments and keep shipment status updated.
        </p>

      </div>


      {/* Statistics */}
      <div className="grid gap-5 md:grid-cols-3 mb-8">

        {/* Pending */}
        <div className="rounded-xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Pending Shipments
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {pendingShipments}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-xl">
              ⏳
            </div>

          </div>

        </div>


        {/* Active */}
        <div className="rounded-xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Active Shipments
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {activeShipments}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-xl">
              🚚
            </div>

          </div>

        </div>


        {/* Completed */}
        <div className="rounded-xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Completed Shipments
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {completedShipments}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-xl">
              ✓
            </div>

          </div>

        </div>

      </div>


      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}


      {/* Recent Shipments */}
      <div className="rounded-xl bg-white shadow-sm">

        <div className="border-b border-slate-200 p-6">

          <h2 className="text-lg font-semibold text-slate-800">
            Recent Shipments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your latest shipment activity.
          </p>

        </div>


        {loading ? (

          <div className="p-8 text-center text-slate-500">
            Loading shipments...
          </div>

        ) : shipments.length === 0 ? (

          <div className="p-8 text-center text-slate-500">
            No shipments available.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Shipment
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Route
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Method
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {shipments.slice(0, 5).map((shipment) => (

                  <tr key={shipment.id}>

                    <td className="px-6 py-4">

                      <p className="font-medium text-slate-800">
                        {shipment.shipment_number}
                      </p>

                      {shipment.tracking_number && (
                        <p className="mt-1 text-xs text-slate-500">
                          {shipment.tracking_number}
                        </p>
                      )}

                    </td>


                    <td className="px-6 py-4 text-sm text-slate-600">

                      {shipment.origin}
                      <span className="mx-2">→</span>
                      {shipment.destination}

                    </td>


                    <td className="px-6 py-4 text-sm text-slate-600">
                      {shipment.shipping_method}
                    </td>


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

        )}

      </div>

    </div>
  )
}

export default ProviderDashboard