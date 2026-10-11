
import { useEffect, useMemo, useState } from 'react'

const API_URL = 'https://smart-cargo.onrender.com/api'

function Shipments() {
  const [showModal, setShowModal] = useState(false)
  const [shipments, setShipments] = useState([])
  const [cargoItems, setCargoItems] = useState([])
  const [providers, setProviders] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(null)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const initialForm = {
    cargo: '',
    origin: '',
    destination: '',
    method: '',
    provider: '',
  }

  const [formData, setFormData] = useState(initialForm)

  // Get the saved login token.
  const getHeaders = () => {
    const token = localStorage.getItem('token')

    return {
      Authorization: `Bearer ${token}`,
    }
  }

  // Handle APIs that return either an array or an object containing an array.
  const getArray = (data, keys = []) => {
    if (Array.isArray(data)) return data

    for (const key of keys) {
      if (Array.isArray(data?.[key])) {
        return data[key]
      }
    }

    return []
  }

  // FETCH SHIPMENTS
  const fetchShipments = async () => {
    try {
      setError('')

      const response = await fetch(`${API_URL}/shipments`, {
        headers: getHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch shipments')
      }

      setShipments(
        getArray(data, ['shipments', 'data'])
      )
    } catch (err) {
      console.error('Fetch shipments error:', err)
      setError(err.message || 'Unable to load shipments')
    } finally {
      setLoading(false)
    }
  }

  // FETCH CARGO
  const fetchCargo = async () => {
    try {
      const response = await fetch(`${API_URL}/cargo`, {
        headers: getHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch cargo')
      }

      setCargoItems(getArray(data, ['cargo', 'items', 'data']))
    } catch (err) {
      console.error('Fetch cargo error:', err)
    }
  }

  // FETCH LOGISTICS PROVIDERS
  const fetchProviders = async () => {
    try {
      const response = await fetch(`${API_URL}/providers`, {
        headers: getHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch providers')
      }

      setProviders(getArray(data, ['providers', 'data']))
    } catch (err) {
      console.error('Fetch providers error:', err)
    }
  }

  // LOAD ALL DATA
  useEffect(() => {
    fetchShipments()
    fetchCargo()
    fetchProviders()
  }, [])

  // FORM INPUT CHANGES
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === 'method' ? { provider: '' } : {}),
    }))
  }

  // PROVIDERS THAT MATCH THE SELECTED TRANSPORT METHOD
  const filteredProviders = useMemo(() => {
    if (!formData.method) return []

    return providers.filter((provider) => {
      const service = String(
        provider.service_type || provider.serviceType || ''
      ).toLowerCase().trim()

      return (
        service === formData.method.toLowerCase() ||
        service === 'all' ||
        service === 'all modes' ||
        service === 'all transport modes'
      )
    })
  }, [providers, formData.method])

  // CREATE SHIPMENT
  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (
      !formData.cargo ||
      !formData.origin.trim() ||
      !formData.destination.trim() ||
      !formData.method ||
      !formData.provider
    ) {
      setError('Please complete all fields before creating the shipment.')
      return
    }

    if (
      formData.origin.trim().toLowerCase() ===
      formData.destination.trim().toLowerCase()
    ) {
      setError('Origin and destination cannot be the same.')
      return
    }

    const selectedCargo = cargoItems.find(
      (cargo) => String(cargo.id) === String(formData.cargo)
    )

    const selectedProvider = filteredProviders.find(
      (provider) => String(provider.id) === String(formData.provider)
    )

    if (!selectedCargo) {
      setError('Please select a valid cargo item.')
      return
    }

    if (!selectedProvider) {
      setError('Please select a provider for the chosen transport method.')
      return
    }

    try {
      setSaving(true)

      const response = await fetch(`${API_URL}/shipments`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cargo_id: selectedCargo.id,
          origin: formData.origin.trim(),
          destination: formData.destination.trim(),
          shipping_method: formData.method,
          provider_id: selectedProvider.id,

          // Cost will be calculated after the Cost Estimator module is built.
          // Zero is displayed as "Pending" in this version.
          estimated_cost: 0,
          currency: 'USD',
          pickup_date: null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create shipment')
      }

      const trackingNumber =
        data.tracking?.tracking_number ||
        data.tracking_number ||
        data.tracking?.trackingNumber

      const shipmentNumber =
        data.shipment?.shipment_number ||
        data.shipment?.shipmentNumber ||
        data.shipment_number

      setSuccess(
        `Shipment ${shipmentNumber || ''} created successfully.` +
        (trackingNumber
          ? ` Tracking Number: ${trackingNumber}`
          : '') +
        ' Estimated shipping cost: Pending.'
      )

      setFormData(initialForm)
      setShowModal(false)

      await fetchShipments()
    } catch (err) {
      console.error('Create shipment error:', err)
      setError(err.message || 'Unable to create shipment')
    } finally {
      setSaving(false)
    }
  }

  // UPDATE SHIPMENT STATUS
  const handleStatusChange = async (id, status) => {
    try {
      setError('')
      setSuccess('')
      setUpdatingStatus(id)

      const response = await fetch(
        `${API_URL}/shipments/${id}/status`,
        {
          method: 'PUT',
          headers: {
            ...getHeaders(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update shipment status')
      }

      setSuccess('Shipment status updated successfully.')
      await fetchShipments()
    } catch (err) {
      console.error('Update status error:', err)
      setError(err.message || 'Unable to update shipment status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  // GET CARGO NAME
  const getCargoName = (cargoId) => {
    const cargo = cargoItems.find(
      (item) => String(item.id) === String(cargoId)
    )

    return (
      cargo?.product_name ||
      cargo?.name ||
      'Not Assigned'
    )
  }

  // GET PROVIDER NAME
  const getProviderName = (providerId) => {
    const provider = providers.find(
      (item) => String(item.id) === String(providerId)
    )

    return provider?.name || provider?.provider_name || 'Not Assigned'
  }

  // FORMAT COST
  const formatCost = (cost, currency) => {
    if (cost === null || cost === undefined || cost === '') {
      return 'Pending'
    }

    const amount = Number(cost)

    if (!Number.isFinite(amount) || amount === 0) {
      return 'Pending'
    }

    return `${currency || 'USD'} ${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // STATUS BADGE STYLE
  const getStatusStyle = (status) => {
    switch (String(status || 'Pending').toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'in transit':
        return 'bg-blue-100 text-blue-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-amber-100 text-amber-700'
    }
  }

  // SEARCH AND FILTER
  const filteredShipments = useMemo(() => {
    const query = search.toLowerCase().trim()

    return shipments.filter((shipment) => {
      const shipmentNumber = String(
        shipment.shipment_number || shipment.shipmentNumber || ''
      ).toLowerCase()

      const trackingNumber = String(
        shipment.tracking_number ||
        shipment.tracking?.tracking_number ||
        ''
      ).toLowerCase()

      const origin = String(shipment.origin || '').toLowerCase()
      const destination = String(shipment.destination || '').toLowerCase()
      const status = String(shipment.status || 'Pending')

      const matchesSearch =
        !query ||
        shipmentNumber.includes(query) ||
        trackingNumber.includes(query) ||
        origin.includes(query) ||
        destination.includes(query) ||
        getCargoName(shipment.cargo_id).toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === 'All' ||
        status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [shipments, cargoItems, search, statusFilter])

  // SUMMARY COUNTS
  const totalShipments = shipments.length

  const pendingShipments = shipments.filter(
    (shipment) =>
      String(shipment.status || 'Pending').toLowerCase() === 'pending'
  ).length

  const inTransitShipments = shipments.filter(
    (shipment) =>
      String(shipment.status || '').toLowerCase() === 'in transit'
  ).length

  const completedShipments = shipments.filter(
    (shipment) =>
      String(shipment.status || '').toLowerCase() === 'completed'
  ).length

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Shipment Management
          </h1>
          <p className="mt-1 text-slate-500">
            Create and manage your cargo shipments
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError('')
            setSuccess('')
            setFormData(initialForm)
            setShowModal(true)
          }}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          + Create Shipment
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-green-700">
          <p className="font-medium">{success}</p>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Shipments</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">
            {totalShipments}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {pendingShipments}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">In Transit</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {inTransitShipments}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {completedShipments}
          </p>
        </div>
      </div>

      {/* SEARCH AND FILTER */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search shipment, tracking number, cargo or route..."
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Transit">In Transit</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* SHIPMENTS TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            All Shipments
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {filteredShipments.length} shipment(s) found
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading shipments...
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium text-slate-700">
              No shipments found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Create a shipment or change your search filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">Shipment</th>
                  <th className="px-5 py-4 font-semibold">Tracking Number</th>
                  <th className="px-5 py-4 font-semibold">Cargo</th>
                  <th className="px-5 py-4 font-semibold">Route</th>
                  <th className="px-5 py-4 font-semibold">Method</th>
                  <th className="px-5 py-4 font-semibold">Provider</th>
                  <th className="px-5 py-4 font-semibold">Cost</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredShipments.map((shipment) => {
                  const shipmentNumber =
                    shipment.shipment_number ||
                    shipment.shipmentNumber ||
                    `#${shipment.id}`

                  const trackingNumber =
                    shipment.tracking_number ||
                    shipment.tracking?.tracking_number ||
                    'Not Available'

                  const status = shipment.status || 'Pending'

                  return (
                    <tr
                      key={shipment.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-medium text-slate-800">
                        {shipmentNumber}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {trackingNumber}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {getCargoName(shipment.cargo_id)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-700">
                          {shipment.origin || '—'}
                        </div>
                        <div className="mt-1 text-slate-400">
                          ↓ {shipment.destination || '—'}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {shipment.shipping_method ||
                          shipment.method ||
                          '—'}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {getProviderName(shipment.provider_id)}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-700">
                        {formatCost(
                          shipment.estimated_cost,
                          shipment.currency
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col items-start gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(status)}`}
                          >
                            {status}
                          </span>

                          <select
                            value={status}
                            disabled={updatingStatus === shipment.id}
                            onChange={(e) =>
                              handleStatusChange(
                                shipment.id,
                                e.target.value
                              )
                            }
                            aria-label={`Update status for ${shipmentNumber}`}
                            className="max-w-[150px] rounded-md border border-slate-300 bg-white px-2 py-2 text-xs outline-none focus:border-blue-500 disabled:cursor-wait disabled:opacity-50"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE SHIPMENT MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !saving) {
              setShowModal(false)
            }
          }}
        >
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Create Shipment
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the shipment details below.
                </p>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={() => setShowModal(false)}
                className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {/* CARGO */}
              <div>
                <label
                  htmlFor="cargo"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Select Cargo *
                </label>

                <select
                  id="cargo"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Choose cargo</option>
                  {cargoItems.map((cargo) => (
                    <option key={cargo.id} value={cargo.id}>
                      {cargo.product_name || cargo.name || `Cargo #${cargo.id}`}
                    </option>
                  ))}
                </select>

                {cargoItems.length === 0 && (
                  <p className="mt-2 text-xs text-amber-600">
                    No cargo items are available. Add cargo first.
                  </p>
                )}
              </div>

              {/* ORIGIN AND DESTINATION */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="origin"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Origin *
                  </label>

                  <input
                    id="origin"
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai, India"
                    required
                    maxLength={200}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="destination"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Destination *
                  </label>

                  <input
                    id="destination"
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="e.g. Dubai, UAE"
                    required
                    maxLength={200}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* TRANSPORT METHOD */}
              <div>
                <label
                  htmlFor="method"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Transport Method *
                </label>

                <select
                  id="method"
                  name="method"
                  value={formData.method}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Choose transport method</option>
                  <option value="Air">Air</option>
                  <option value="Sea">Sea</option>
                  <option value="Road">Road</option>
                </select>
              </div>

              {/* PROVIDER */}
              <div>
                <label
                  htmlFor="provider"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Logistics Provider *
                </label>

                <select
                  id="provider"
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                  required
                  disabled={!formData.method}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">
                    {!formData.method
                      ? 'Choose a transport method first'
                      : 'Choose logistics provider'}
                  </option>

                  {filteredProviders.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name ||
                        provider.provider_name ||
                        `Provider #${provider.id}`}
                    </option>
                  ))}
                </select>

                {formData.method && filteredProviders.length === 0 && (
                  <p className="mt-2 text-xs text-amber-600">
                    No providers match this transport method. Check the
                    service types configured in your provider records.
                  </p>
                )}
              </div>

              {/* ESTIMATED COST */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">
                      Estimated Shipping Cost
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      The cost will be calculated when the Cost Estimator
                      module is available.
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                    Pending
                  </span>
                </div>
              </div>

              {/* FORM BUTTONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setShowModal(false)
                    setError('')
                  }}
                  className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    cargoItems.length === 0 ||
                    filteredProviders.length === 0
                  }
                  className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? 'Creating Shipment...' : 'Create Shipment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Shipments
