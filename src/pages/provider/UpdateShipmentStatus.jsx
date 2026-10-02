import { useState } from 'react'

function UpdateShipmentStatus() {
  const [shipments, setShipments] = useState([
    {
      id: 1,
      tracking: 'SC-10024',
      cargo: 'Electronic Components',
      route: 'Mumbai → Dubai',
      method: 'Air',
      status: 'In Transit',
      note: '',
    },
    {
      id: 2,
      tracking: 'SC-10021',
      cargo: 'Automobile Parts',
      route: 'Mumbai → Hamburg',
      method: 'Sea',
      status: 'Pickup Pending',
      note: '',
    },
    {
      id: 3,
      tracking: 'SC-10018',
      cargo: 'Textile Products',
      route: 'Pune → Singapore',
      method: 'Sea',
      status: 'Delivered',
      note: '',
    },
  ])

  const [selectedId, setSelectedId] = useState(1)
  const [newStatus, setNewStatus] = useState('In Transit')
  const [note, setNote] = useState('')
  const [success, setSuccess] = useState(false)

  const selectedShipment = shipments.find(
    (shipment) => shipment.id === Number(selectedId)
  )

  const handleShipmentChange = (e) => {
    const id = Number(e.target.value)
    setSelectedId(id)

    const shipment = shipments.find((item) => item.id === id)

    if (shipment) {
      setNewStatus(shipment.status)
      setNote(shipment.note)
    }
  }

  const handleUpdate = (e) => {
    e.preventDefault()

    setShipments(
      shipments.map((shipment) =>
        shipment.id === Number(selectedId)
          ? {
              ...shipment,
              status: newStatus,
              note: note,
            }
          : shipment
      )
    )

    setSuccess(true)

    setTimeout(() => {
      setSuccess(false)
    }, 3000)
  }

  const getStatusStyle = (status) => {
    if (status === 'Delivered') {
      return 'bg-green-100 text-green-700'
    }

    if (status === 'In Transit') {
      return 'bg-blue-100 text-blue-700'
    }

    if (status === 'Arrived at Destination') {
      return 'bg-purple-100 text-purple-700'
    }

    if (status === 'Picked Up') {
      return 'bg-yellow-100 text-yellow-700'
    }

    return 'bg-orange-100 text-orange-700'
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Update Shipment Status
        </h1>
        <p className="mt-2 text-slate-500">
          Update the pickup, transport, and delivery status of assigned shipments.
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-green-700">
          Shipment status updated successfully.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Update Form */}
        <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-6 text-xl font-semibold text-slate-800">
            Shipment Status Update
          </h2>

          <form onSubmit={handleUpdate} className="space-y-5">
            {/* Shipment */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Select Shipment
              </label>

              <select
                value={selectedId}
                onChange={handleShipmentChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              >
                {shipments.map((shipment) => (
                  <option key={shipment.id} value={shipment.id}>
                    {shipment.tracking} — {shipment.cargo}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Shipment Status
              </label>

              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="Pickup Pending">Pickup Pending</option>
                <option value="Picked Up">Picked Up</option>
                <option value="In Transit">In Transit</option>
                <option value="Arrived at Destination">
                  Arrived at Destination
                </option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            {/* Note */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status Note
              </label>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows="5"
                placeholder="Enter an optional update note..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Update Status
            </button>
          </form>
        </div>

        {/* Shipment Details */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-slate-800">
            Shipment Details
          </h2>

          {selectedShipment && (
            <div className="space-y-5">
              <div>
                <p className="text-sm text-slate-500">Tracking Number</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {selectedShipment.tracking}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Cargo</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {selectedShipment.cargo}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Route</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {selectedShipment.route}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Transport Method</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {selectedShipment.method}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Current Status</p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusStyle(
                    selectedShipment.status
                  )}`}
                >
                  {selectedShipment.status}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Information */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold text-slate-800">
          Status Flow
        </h2>

        <div className="grid gap-4 md:grid-cols-5">
          {[
            'Pickup Pending',
            'Picked Up',
            'In Transit',
            'Arrived at Destination',
            'Delivered',
          ].map((status, index) => (
            <div
              key={status}
              className="rounded-lg border border-slate-200 p-4 text-center"
            >
              <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                {index + 1}
              </div>

              <p className="text-sm font-medium text-slate-700">
                {status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UpdateShipmentStatus