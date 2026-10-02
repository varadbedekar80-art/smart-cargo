import { useState } from 'react'

function Shipments() {
  const [showModal, setShowModal] = useState(false)

  const [shipments, setShipments] = useState([
    {
      id: 1,
      tracking: 'SC-10024',
      cargo: 'Electronic Components',
      origin: 'Mumbai, India',
      destination: 'Dubai, UAE',
      method: 'Air',
      provider: 'Global Express',
      cost: '$2,450',
      status: 'In Transit',
    },
    {
      id: 2,
      tracking: 'SC-10023',
      cargo: 'Cotton Textiles',
      origin: 'Pune, India',
      destination: 'Singapore',
      method: 'Sea',
      provider: 'Ocean Logistics',
      cost: '$1,850',
      status: 'Pending',
    },
    {
      id: 3,
      tracking: 'SC-10022',
      cargo: 'Machine Parts',
      origin: 'Nashik, India',
      destination: 'London, UK',
      method: 'Air',
      provider: 'Global Express',
      cost: '$3,200',
      status: 'Completed',
    },
  ])

  const [formData, setFormData] = useState({
    cargo: '',
    origin: '',
    destination: '',
    method: '',
    provider: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newShipment = {
      id: Date.now(),
      tracking: `SC-${10000 + shipments.length + 1}`,
      cargo: formData.cargo,
      origin: formData.origin,
      destination: formData.destination,
      method: formData.method,
      provider: formData.provider,
      cost: 'Pending',
      status: 'Pending',
    }

    setShipments([...shipments, newShipment])

    setFormData({
      cargo: '',
      origin: '',
      destination: '',
      method: '',
      provider: '',
    })

    setShowModal(false)
  }

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h3 className="text-2xl font-bold">
            Shipment Management
          </h3>

          <p className="text-slate-500 mt-1">
            Create, monitor and manage your cargo shipments.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium"
        >
          + Create Shipment
        </button>

      </div>


      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">

        <SummaryCard
          title="Total"
          value={shipments.length}
        />

        <SummaryCard
          title="Pending"
          value={
            shipments.filter(
              (shipment) => shipment.status === 'Pending'
            ).length
          }
        />

        <SummaryCard
          title="In Transit"
          value={
            shipments.filter(
              (shipment) => shipment.status === 'In Transit'
            ).length
          }
        />

        <SummaryCard
          title="Completed"
          value={
            shipments.filter(
              (shipment) => shipment.status === 'Completed'
            ).length
          }
        />

      </div>


      {/* Search / Filter */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Search by tracking number, cargo or destination..."
            className="flex-1 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select className="border border-slate-200 rounded-lg px-4 py-3">
            <option>All Status</option>
            <option>Pending</option>
            <option>In Transit</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>

          <select className="border border-slate-200 rounded-lg px-4 py-3">
            <option>All Methods</option>
            <option>Air</option>
            <option>Sea</option>
            <option>Road</option>
          </select>

        </div>

      </div>


      {/* Shipment Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        <div className="p-6 border-b">

          <h4 className="text-lg font-bold">
            All Shipments
          </h4>

          <p className="text-sm text-slate-500 mt-1">
            {shipments.length} shipments found
          </p>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="text-left px-5 py-4 text-sm">
                  Tracking ID
                </th>

                <th className="text-left px-5 py-4 text-sm">
                  Cargo
                </th>

                <th className="text-left px-5 py-4 text-sm">
                  Route
                </th>

                <th className="text-left px-5 py-4 text-sm">
                  Method
                </th>

                <th className="text-left px-5 py-4 text-sm">
                  Provider
                </th>

                <th className="text-left px-5 py-4 text-sm">
                  Cost
                </th>

                <th className="text-left px-5 py-4 text-sm">
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {shipments.map((shipment) => (

                <tr
                  key={shipment.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-5 py-4 font-semibold text-blue-600">
                    {shipment.tracking}
                  </td>

                  <td className="px-5 py-4">
                    {shipment.cargo}
                  </td>

                  <td className="px-5 py-4">

                    <div className="text-sm">
                      {shipment.origin}
                    </div>

                    <div className="text-xs text-slate-400">
                      ↓
                    </div>

                    <div className="text-sm">
                      {shipment.destination}
                    </div>

                  </td>

                  <td className="px-5 py-4">
                    {shipment.method}
                  </td>

                  <td className="px-5 py-4">
                    {shipment.provider}
                  </td>

                  <td className="px-5 py-4 font-medium">
                    {shipment.cost}
                  </td>

                  <td className="px-5 py-4">

                    <StatusBadge status={shipment.status} />

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* Create Shipment Modal */}
      {showModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">

            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">

              <div>
                <h3 className="text-xl font-bold">
                  Create Shipment
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Enter the basic shipment details.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-slate-800 text-xl"
              >
                ✕
              </button>

            </div>


            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Cargo */}
                <div className="md:col-span-2">

                  <label className="block text-sm font-medium mb-2">
                    Cargo
                  </label>

                  <select
                    required
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3"
                  >

                    <option value="">
                      Select Cargo
                    </option>

                    <option>
                      Electronic Components
                    </option>

                    <option>
                      Cotton Textiles
                    </option>

                    <option>
                      Machine Parts
                    </option>

                    <option>
                      Other Cargo
                    </option>

                  </select>

                </div>


                {/* Origin */}
                <div>

                  <label className="block text-sm font-medium mb-2">
                    Origin / Pickup Location
                  </label>

                  <input
                    required
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai, India"
                    className="w-full border border-slate-200 rounded-lg px-4 py-3"
                  />

                </div>


                {/* Destination */}
                <div>

                  <label className="block text-sm font-medium mb-2">
                    Destination
                  </label>

                  <input
                    required
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="e.g. Dubai, UAE"
                    className="w-full border border-slate-200 rounded-lg px-4 py-3"
                  />

                </div>


                {/* Transport Method */}
                <div>

                  <label className="block text-sm font-medium mb-2">
                    Transport Method
                  </label>

                  <select
                    required
                    name="method"
                    value={formData.method}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3"
                  >

                    <option value="">
                      Select Method
                    </option>

                    <option>Air</option>
                    <option>Sea</option>
                    <option>Road</option>

                  </select>

                </div>


                {/* Provider */}
                <div>

                  <label className="block text-sm font-medium mb-2">
                    Logistics Provider
                  </label>

                  <select
                    required
                    name="provider"
                    value={formData.provider}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3"
                  >

                    <option value="">
                      Select Provider
                    </option>

                    <option>Global Express</option>
                    <option>Ocean Logistics</option>
                    <option>FastTrack Cargo</option>

                  </select>

                </div>

              </div>


              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-8">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Create Shipment
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}


/* Summary Card */

function SummaryCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h3 className="text-2xl font-bold mt-2">
        {value}
      </h3>

    </div>
  )
}


/* Status Badge */

function StatusBadge({ status }) {

  let styles = 'bg-slate-100 text-slate-700'

  if (status === 'Pending') {
    styles = 'bg-yellow-100 text-yellow-700'
  }

  if (status === 'In Transit') {
    styles = 'bg-blue-100 text-blue-700'
  }

  if (status === 'Completed') {
    styles = 'bg-green-100 text-green-700'
  }

  if (status === 'Cancelled') {
    styles = 'bg-red-100 text-red-700'
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  )
}

export default Shipments