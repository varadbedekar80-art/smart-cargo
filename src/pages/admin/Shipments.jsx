import { useEffect, useState } from 'react'

function Shipments() {
  const [shipments, setShipments] = useState([])
  const [providers, setProviders] = useState([])

  const [loading, setLoading] = useState(true)
  const [providersLoading, setProvidersLoading] = useState(true)

  const [error, setError] = useState('')
  const [assigningId, setAssigningId] = useState(null)

  const token = localStorage.getItem('token')

  const fetchShipments = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        'https://smart-cargo.onrender.com/api/admin/shipments',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const contentType =
        response.headers.get('content-type') || ''

      if (!contentType.includes('application/json')) {
        throw new Error(
          'Server returned an invalid response.'
        )
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load shipments'
        )
      }

      setShipments(Array.isArray(data) ? data : [])

    } catch (error) {
      console.error(
        'GET ADMIN SHIPMENTS ERROR:',
        error
      )

      setError(
        error.message || 'Failed to load shipments'
      )
    } finally {
      setLoading(false)
    }
  }

  const fetchProviders = async () => {
    try {
      setProvidersLoading(true)

      const response = await fetch(
        'https://smart-cargo.onrender.com/api/admin/providers',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const contentType =
        response.headers.get('content-type') || ''

      if (!contentType.includes('application/json')) {
        throw new Error(
          'Server returned an invalid provider response.'
        )
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load providers'
        )
      }

      setProviders(Array.isArray(data) ? data : [])

    } catch (error) {
      console.error(
        'GET ADMIN PROVIDERS ERROR:',
        error
      )

      setError(
        error.message || 'Failed to load providers'
      )
    } finally {
      setProvidersLoading(false)
    }
  }

  useEffect(() => {
    fetchShipments()
    fetchProviders()
  }, [])

  const updateStatus = async (id, newStatus) => {
    try {
      setError('')

      const response = await fetch(
        `https://smart-cargo.onrender.com/api/admin/shipments/${id}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to update shipment status'
        )
      }

      setShipments((currentShipments) =>
        currentShipments.map((shipment) =>
          shipment.id === id
            ? {
                ...shipment,
                status: newStatus,
              }
            : shipment
        )
      )

    } catch (error) {
      console.error(
        'UPDATE ADMIN SHIPMENT STATUS ERROR:',
        error
      )

      setError(
        error.message ||
          'Failed to update shipment status'
      )
    }
  }

  const assignProvider = async (
    shipmentId,
    providerId
  ) => {
    if (!providerId) {
      return
    }

    try {
      setError('')
      setAssigningId(shipmentId)

      const response = await fetch(
        `https://smart-cargo.onrender.com/api/admin/shipments/${shipmentId}/provider`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            provider_id: Number(providerId),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to assign provider'
        )
      }

      setShipments((currentShipments) =>
        currentShipments.map((shipment) =>
          shipment.id === shipmentId
            ? {
                ...shipment,
                provider_name:
                  data.provider?.name ||
                  'Not assigned',
              }
            : shipment
        )
      )

    } catch (error) {
      console.error(
        'ASSIGN PROVIDER ERROR:',
        error
      )

      setError(
        error.message ||
          'Failed to assign provider'
      )
    } finally {
      setAssigningId(null)
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700'

      case 'In Transit':
        return 'bg-blue-100 text-blue-700'

      case 'Pending':
        return 'bg-yellow-100 text-yellow-700'

      case 'Cancelled':
        return 'bg-red-100 text-red-700'

      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const pendingCount = shipments.filter(
    (shipment) => shipment.status === 'Pending'
  ).length

  const inTransitCount = shipments.filter(
    (shipment) => shipment.status === 'In Transit'
  ).length

  const completedCount = shipments.filter(
    (shipment) => shipment.status === 'Completed'
  ).length

  const cancelledCount = shipments.filter(
    (shipment) => shipment.status === 'Cancelled'
  ).length

  return (
    <div>

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Shipment Management
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor and manage all shipments across the platform.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="mb-6 grid gap-5 md:grid-cols-2 lg:grid-cols-5">

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Shipments
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {shipments.length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Pending
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            In Transit
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {inTransitCount}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Completed
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {completedCount}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Cancelled
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {cancelledCount}
          </p>
        </div>

      </div>

      {/* SHIPMENTS TABLE */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-800">
            All Shipments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            View and manage shipments created by business users.
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading shipments...
          </div>
        ) : shipments.length === 0 ? (
          <div className="p-10 text-center">

            <p className="text-lg font-medium text-slate-700">
              No shipments found
            </p>

            <p className="mt-2 text-sm text-slate-500">
              There are currently no shipments available in the system.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Tracking ID
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Shipment
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Business / Owner
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Route
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Method
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Provider
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Cost
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y">

                {shipments.map((shipment) => (

                  <tr
                    key={shipment.id}
                    className="hover:bg-slate-50"
                  >

                    {/* TRACKING */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-blue-600">
                        {shipment.tracking_number ||
                          'Not Available'}
                      </div>
                    </td>

                    {/* SHIPMENT + CARGO */}
                    <td className="px-6 py-4">

                      <div className="font-medium text-slate-700">
                        {shipment.shipment_number ||
                          'Not Available'}
                      </div>

                      <div className="mt-1 text-sm text-slate-500">
                        {shipment.cargo_name ||
                          'Cargo not specified'}
                      </div>

                    </td>

                    {/* BUSINESS + OWNER */}
                    <td className="px-6 py-4">

                      <div className="font-medium text-slate-700">
                        {shipment.business_name ||
                          'No business profile'}
                      </div>

                      <div className="mt-1 text-sm text-slate-500">
                        Owner:{' '}
                        {shipment.owner_name ||
                          'Not Available'}
                      </div>

                      {shipment.owner_email && (
                        <div className="mt-1 text-xs text-slate-400">
                          {shipment.owner_email}
                        </div>
                      )}

                    </td>

                    {/* ROUTE */}
                    <td className="px-6 py-4">

                      <div className="text-sm font-medium text-slate-700">
                        {shipment.origin ||
                          'Not Available'}
                      </div>

                      <div className="my-1 text-xs text-slate-400">
                        ↓
                      </div>

                      <div className="text-sm font-medium text-slate-700">
                        {shipment.destination ||
                          'Not Available'}
                      </div>

                    </td>

                    {/* METHOD */}
                    <td className="px-6 py-4">

                      <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-700">
                        {shipment.shipping_method ||
                          'Not Available'}
                      </span>

                    </td>

                    {/* PROVIDER */}
                    <td className="px-6 py-4">

                      <div className="mb-2 text-sm font-medium text-slate-700">
                        {shipment.provider_name ||
                          'Not assigned'}
                      </div>

                      <select
                        value=""
                        disabled={
                          providersLoading ||
                          assigningId === shipment.id
                        }
                        onChange={(e) =>
                          assignProvider(
                            shipment.id,
                            e.target.value
                          )
                        }
                        className="w-full min-w-[170px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                      >

                        <option value="">
                          {assigningId === shipment.id
                            ? 'Assigning...'
                            : providersLoading
                              ? 'Loading providers...'
                              : 'Assign Provider'}
                        </option>

                        {providers
                          .filter(
                            (provider) =>
                              provider.status === 'Active'
                          )
                          .map((provider) => (
                            <option
                              key={provider.id}
                              value={provider.id}
                            >
                              {provider.name}
                              {' — '}
                              {provider.service_type}
                            </option>
                          ))}

                      </select>

                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                          shipment.status
                        )}`}
                      >
                        {shipment.status ||
                          'Pending'}
                      </span>

                    </td>

                    {/* COST */}
                    <td className="px-6 py-4">

                      <div className="font-medium text-slate-700">
                        {shipment.estimated_cost !== null &&
                        shipment.estimated_cost !== undefined
                          ? `${shipment.currency || 'USD'} ${Number(
                              shipment.estimated_cost
                            ).toFixed(2)}`
                          : 'Not Available'}
                      </div>

                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-4">

                      <select
                        value={
                          shipment.status ||
                          'Pending'
                        }
                        onChange={(e) =>
                          updateStatus(
                            shipment.id,
                            e.target.value
                          )
                        }
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="In Transit">
                          In Transit
                        </option>

                        <option value="Completed">
                          Completed
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>

                      </select>

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

export default Shipments
