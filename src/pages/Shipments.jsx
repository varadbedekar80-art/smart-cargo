import { useEffect, useState } from 'react'

function Shipments() {
  const [showModal, setShowModal] = useState(false)

  const [shipments, setShipments] = useState([])
  const [cargoItems, setCargoItems] = useState([])
  const [providers, setProviders] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    cargo: '',
    origin: '',
    destination: '',
    method: '',
    provider: '',
  })

  // ==============================
  // FETCH SHIPMENTS
  // ==============================

  const fetchShipments = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:5000/api/shipments',
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

      setError(
        error.message || 'Unable to load shipments'
      )

    } finally {
      setLoading(false)
    }
  }


  // ==============================
  // FETCH CARGO
  // ==============================

  const fetchCargo = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:5000/api/cargo',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch cargo'
        )
      }

      setCargoItems(data)

    } catch (error) {
      console.error(error)
    }
  }


  // ==============================
  // FETCH PROVIDERS
  // ==============================

  const fetchProviders = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:5000/api/providers',
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
    }
  }


  // ==============================
  // LOAD DATA
  // ==============================

  useEffect(() => {
    fetchShipments()
    fetchCargo()
    fetchProviders()
  }, [])


  // ==============================
  // FORM CHANGE
  // ==============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }


  // ==============================
  // CREATE SHIPMENT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const token = localStorage.getItem('token')

      const selectedCargo = cargoItems.find(
        (cargo) =>
          cargo.id.toString() === formData.cargo
      )

      const selectedProvider = providers.find(
        (provider) =>
          provider.id.toString() === formData.provider
      )

      const response = await fetch(
        'http://localhost:5000/api/shipments',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            cargo_id: selectedCargo
              ? selectedCargo.id
              : null,

            origin: formData.origin,

            destination: formData.destination,

            shipping_method: formData.method,

            provider_id: selectedProvider
              ? selectedProvider.id
              : null,

            estimated_cost: 0,

            currency: 'USD',

            pickup_date: null,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to create shipment'
        )
      }


      // ==============================
      // SHOW GENERATED TRACKING NUMBER
      // ==============================

      const trackingNumber =
        data.tracking?.tracking_number

      const shipmentNumber =
        data.shipment?.shipment_number


      if (trackingNumber) {
        setSuccess(
          `Shipment ${shipmentNumber} created successfully. Tracking Number: ${trackingNumber}`
        )
      } else {
        setSuccess(
          `Shipment ${shipmentNumber || ''} created successfully.`
        )
      }


      // Refresh shipment list
      await fetchShipments()


      // Reset form
      setFormData({
        cargo: '',
        origin: '',
        destination: '',
        method: '',
        provider: '',
      })

      setShowModal(false)

    } catch (error) {
      console.error(error)

      setError(
        error.message || 'Unable to create shipment'
      )

    } finally {
      setSaving(false)
    }
  }


  // ==============================
  // DELETE SHIPMENT
  // ==============================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this shipment?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        `http://localhost:5000/api/shipments/${id}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to delete shipment'
        )
      }

      await fetchShipments()

    } catch (error) {
      console.error(error)

      setError(
        error.message || 'Unable to delete shipment'
      )
    }
  }


  // ==============================
  // UPDATE STATUS
  // ==============================

  const handleStatusChange = async (id, status) => {
    try {
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        `http://localhost:5000/api/shipments/${id}/status`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to update status'
        )
      }

      await fetchShipments()

    } catch (error) {
      console.error(error)

      setError(
        error.message || 'Unable to update shipment status'
      )
    }
  }


  // ==============================
  // GET CARGO NAME
  // ==============================

  const getCargoName = (cargoId) => {
    const cargo = cargoItems.find(
      (item) => item.id === cargoId
    )

    return cargo
      ? cargo.product_name
      : 'Not Assigned'
  }


  // ==============================
  // FORMAT COST
  // ==============================

  const formatCost = (cost, currency) => {
    if (!cost || Number(cost) === 0) {
      return 'Pending'
    }

    return `${currency || 'USD'} ${Number(cost).toLocaleString()}`
  }


  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* ==============================
          HEADER
      ============================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Shipment Management
          </h1>

          <p className="text-slate-500 mt-1">
            Create and manage your cargo shipments
          </p>
        </div>

        <button
          onClick={() => {
            setError('')
            setSuccess('')
            setShowModal(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition"
        >
          + Create Shipment
        </button>

      </div>


      {/* ==============================
          SUCCESS MESSAGE
      ============================== */}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-lg">

          <p className="font-medium">
            {success}
          </p>

        </div>
      )}


      {/* ==============================
          ERROR
      ============================== */}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}


      {/* ==============================
          SUMMARY CARDS
      ============================== */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

        <div className="bg-white border border-slate-200 rounded-xl p-5">

          <p className="text-sm text-slate-500">
            Total Shipments
          </p>

          <p className="text-2xl font-bold text-slate-800 mt-2">
            {shipments.length}
          </p>

        </div>


        <div className="bg-white border border-slate-200 rounded-xl p-5">

          <p className="text-sm text-slate-500">
            Pending
          </p>

          <p className="text-2xl font-bold text-yellow-600 mt-2">
            {
              shipments.filter(
                (shipment) =>
                  shipment.status === 'Pending'
              ).length
            }
          </p>

        </div>


        <div className="bg-white border border-slate-200 rounded-xl p-5">

          <p className="text-sm text-slate-500">
            In Transit
          </p>

          <p className="text-2xl font-bold text-blue-600 mt-2">
            {
              shipments.filter(
                (shipment) =>
                  shipment.status === 'In Transit'
              ).length
            }
          </p>

        </div>


        <div className="bg-white border border-slate-200 rounded-xl p-5">

          <p className="text-sm text-slate-500">
            Completed
          </p>

          <p className="text-2xl font-bold text-green-600 mt-2">
            {
              shipments.filter(
                (shipment) =>
                  shipment.status === 'Completed'
              ).length
            }
          </p>

        </div>

      </div>


      {/* ==============================
          SHIPMENT TABLE
      ============================== */}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-200">

          <h2 className="text-lg font-semibold text-slate-800">
            Your Shipments
          </h2>

        </div>


        {loading ? (

          <div className="p-10 text-center text-slate-500">
            Loading shipments...
          </div>

        ) : shipments.length === 0 ? (

          <div className="p-10 text-center">

            <p className="text-slate-500 mb-4">
              No shipments found.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first shipment
            </button>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Shipment
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Tracking Number
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Cargo
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Route
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Method
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Provider
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Cost
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {shipments.map((shipment) => (

                  <tr
                    key={shipment.id}
                    className="hover:bg-slate-50"
                  >

                    {/* SHIPMENT */}

                    <td className="px-6 py-4">

                      <p className="font-semibold text-slate-800">
                        {shipment.shipment_number}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        ID: {shipment.id}
                      </p>

                    </td>


                    {/* TRACKING NUMBER */}

                    <td className="px-6 py-4">

                      <p className="font-semibold text-blue-600">
                        {shipment.tracking_number || 'Not Available'}
                      </p>

                    </td>


                    {/* CARGO */}

                    <td className="px-6 py-4 text-slate-700">
                      {getCargoName(shipment.cargo_id)}
                    </td>


                    {/* ROUTE */}

                    <td className="px-6 py-4">

                      <p className="text-slate-700">
                        {shipment.origin}
                      </p>

                      <p className="text-xs text-slate-400 my-1">
                        ↓
                      </p>

                      <p className="text-slate-700">
                        {shipment.destination}
                      </p>

                    </td>


                    {/* METHOD */}

                    <td className="px-6 py-4">

                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                        {shipment.shipping_method}
                      </span>

                    </td>


                    {/* PROVIDER */}

                    <td className="px-6 py-4">

                      <p className="text-slate-700">
                        {shipment.provider_name ||
                          'Not Assigned'}
                      </p>

                      {shipment.provider_service_type && (
                        <p className="text-xs text-slate-400 mt-1">
                          {shipment.provider_service_type}
                        </p>
                      )}

                    </td>


                    {/* COST */}

                    <td className="px-6 py-4 text-slate-700">

                      {formatCost(
                        shipment.estimated_cost,
                        shipment.currency
                      )}

                    </td>


                    {/* STATUS */}

                    <td className="px-6 py-4">

                      <select
                        value={shipment.status || 'Pending'}
                        onChange={(e) =>
                          handleStatusChange(
                            shipment.id,
                            e.target.value
                          )
                        }
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
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


                    {/* DELETE */}

                    <td className="px-6 py-4">

                      <button
                        onClick={() =>
                          handleDelete(shipment.id)
                        }
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ==============================
          CREATE SHIPMENT MODAL
      ============================== */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">


            {/* MODAL HEADER */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

              <div>

                <h2 className="text-xl font-bold text-slate-800">
                  Create Shipment
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Enter shipment details
                </p>

              </div>


              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl"
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* CARGO */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cargo
                </label>

                <select
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">
                    Select cargo
                  </option>

                  {cargoItems.map((cargo) => (

                    <option
                      key={cargo.id}
                      value={cargo.id}
                    >
                      {cargo.product_name} — {cargo.quantity} units
                    </option>

                  ))}

                </select>


                {cargoItems.length === 0 && (

                  <p className="text-xs text-red-500 mt-2">
                    No cargo available. Please add cargo first.
                  </p>

                )}

              </div>


              {/* ORIGIN */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Origin
                </label>

                <input
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  placeholder="Mumbai, India"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>


              {/* DESTINATION */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Destination
                </label>

                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="Dubai, UAE"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>


              {/* TRANSPORT METHOD */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Transport Method
                </label>

                <select
                  name="method"
                  value={formData.method}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">
                    Select transport method
                  </option>

                  <option value="Air">
                    Air
                  </option>

                  <option value="Sea">
                    Sea
                  </option>

                  <option value="Road">
                    Road
                  </option>

                </select>

              </div>


              {/* LOGISTICS PROVIDER */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Logistics Provider
                </label>

                <select
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">
                    Select logistics provider
                  </option>

                  {providers.map((provider) => (

                    <option
                      key={provider.id}
                      value={provider.id}
                    >
                      {provider.name} — {provider.service_type}
                    </option>

                  ))}

                </select>


                {providers.length === 0 && (

                  <p className="text-xs text-red-500 mt-2">
                    No active logistics providers available.
                  </p>

                )}

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium"
                >
                  {saving
                    ? 'Creating...'
                    : 'Create Shipment'}
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