import { useEffect, useState } from 'react'

function UpdateShipmentStatus() {
  const [shipments, setShipments] = useState([])
  const [selectedShipment, setSelectedShipment] = useState('')
  const [status, setStatus] = useState('Pending')

  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const statuses = [
    'Pending',
    'In Transit',
    'Completed',
    'Cancelled',
  ]

  useEffect(() => {
    fetchShipments()
  }, [])

  const fetchShipments = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        'https://smart-cargo.onrender.com/api/provider/shipments/${selectedShipment}/status',
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

  const handleShipmentChange = (e) => {
    const shipmentId = e.target.value

    setSelectedShipment(shipmentId)
    setSuccess('')
    setError('')

    const shipment = shipments.find(
      (item) => String(item.id) === String(shipmentId)
    )

    if (shipment) {
      setStatus(shipment.status || 'Pending')
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (!selectedShipment) {
      setError('Please select a shipment.')
      return
    }

    if (!status) {
      setError('Please select a status.')
      return
    }

    try {
      setUpdating(true)

      const token = localStorage.getItem('token')

      const response = await fetch(
        `https://smart-cargo.onrender.com/api/provider/shipments/${selectedShipment}/status`,
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
          data.message || 'Failed to update shipment status'
        )
      }

      setSuccess(
        'Shipment status updated successfully.'
      )

      await fetchShipments()

    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div>

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-2xl font-bold text-slate-800">
          Update Shipment Status
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update the transportation status of a shipment.
        </p>

      </div>


      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}


      {/* Success */}
      {success && (
        <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}


      {/* Form */}
      <div className="max-w-2xl rounded-xl bg-white p-8 shadow-sm">

        <form
          onSubmit={handleUpdate}
          className="space-y-6"
        >

          {/* Shipment */}
          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Select Shipment
            </label>

            {loading ? (

              <div className="rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-500">
                Loading shipments...
              </div>

            ) : shipments.length === 0 ? (

              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                No shipments available.
              </div>

            ) : (

              <select
                value={selectedShipment}
                onChange={handleShipmentChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              >

                <option value="">
                  Select a shipment
                </option>

                {shipments.map((shipment) => (

                  <option
                    key={shipment.id}
                    value={shipment.id}
                  >
                    {shipment.shipment_number}
                    {' — '}
                    {shipment.origin}
                    {' → '}
                    {shipment.destination}
                  </option>

                ))}

              </select>

            )}

          </div>


          {/* Current shipment information */}
          {selectedShipment && (

            <div className="rounded-lg bg-slate-50 p-5">

              {(() => {

                const shipment = shipments.find(
                  (item) =>
                    String(item.id) ===
                    String(selectedShipment)
                )

                if (!shipment) {
                  return null
                }

                return (
                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>

                      <p className="text-xs text-slate-500">
                        Shipment Number
                      </p>

                      <p className="mt-1 font-medium text-slate-800">
                        {shipment.shipment_number}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Tracking Number
                      </p>

                      <p className="mt-1 font-medium text-slate-800">
                        {shipment.tracking_number ||
                          'Not available'}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Origin
                      </p>

                      <p className="mt-1 font-medium text-slate-800">
                        {shipment.origin}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Destination
                      </p>

                      <p className="mt-1 font-medium text-slate-800">
                        {shipment.destination}
                      </p>

                    </div>

                  </div>
                )

              })()}

            </div>

          )}


          {/* Status */}
          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              New Shipment Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            >

              {statuses.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              ))}

            </select>

          </div>


          {/* Update Button */}
          <button
            type="submit"
            disabled={
              updating ||
              loading ||
              !selectedShipment
            }
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {updating
              ? 'Updating...'
              : 'Update Shipment Status'}
          </button>

        </form>

      </div>


      {/* Status Flow */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-slate-800">
          Shipment Status Flow
        </h2>

        <div className="mt-5 flex flex-wrap items-center gap-3">

          <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700">
            Pending
          </span>

          <span className="text-slate-400">
            →
          </span>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            In Transit
          </span>

          <span className="text-slate-400">
            →
          </span>

          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
            Completed
          </span>

        </div>

        <p className="mt-4 text-sm text-slate-500">
          A shipment may also be marked as Cancelled when required.
        </p>

      </div>

    </div>
  )
}

export default UpdateShipmentStatus