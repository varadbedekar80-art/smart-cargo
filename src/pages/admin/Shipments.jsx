import { useState } from 'react'

function Shipments() {
  const [shipments, setShipments] = useState([
    {
      id: 1,
      tracking: 'SC-10024',
      cargo: 'Electronic Components',
      business: 'ABC Electronics Pvt. Ltd.',
      route: 'Mumbai → Dubai',
      method: 'Air',
      status: 'In Transit',
      cost: '$2,450',
    },
    {
      id: 2,
      tracking: 'SC-10023',
      cargo: 'Cotton Textiles',
      business: 'Cotton Exporters Ltd.',
      route: 'Pune → Singapore',
      method: 'Sea',
      status: 'Pending',
      cost: '$1,850',
    },
    {
      id: 3,
      tracking: 'SC-10022',
      cargo: 'Machine Parts',
      business: 'Industrial Parts Co.',
      route: 'Nashik → London',
      method: 'Air',
      status: 'Completed',
      cost: '$3,200',
    },
    {
      id: 4,
      tracking: 'SC-10021',
      cargo: 'Automobile Parts',
      business: 'Metro Auto Exports',
      route: 'Mumbai → Hamburg',
      method: 'Sea',
      status: 'In Transit',
      cost: '$2,780',
    },
  ])

  const updateStatus = (id, newStatus) => {
    setShipments(
      shipments.map((shipment) =>
        shipment.id === id
          ? { ...shipment, status: newStatus }
          : shipment
      )
    )
  }

  const getStatusStyle = (status) => {
    if (status === 'Completed') {
      return 'bg-green-100 text-green-700'
    }

    if (status === 'In Transit') {
      return 'bg-blue-100 text-blue-700'
    }

    if (status === 'Pending') {
      return 'bg-yellow-100 text-yellow-700'
    }

    return 'bg-red-100 text-red-700'
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Shipment Management
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor and manage all shipments across the platform.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

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
            {shipments.filter(
              (shipment) => shipment.status === 'Pending'
            ).length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            In Transit
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {shipments.filter(
              (shipment) => shipment.status === 'In Transit'
            ).length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Completed
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {shipments.filter(
              (shipment) => shipment.status === 'Completed'
            ).length}
          </p>
        </div>

      </div>

      {/* Shipments Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-800">
            All Shipments
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">
              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Tracking ID
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Cargo
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Business
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Route
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Method
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

                  <td className="px-6 py-4 font-medium text-blue-600">
                    {shipment.tracking}
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    {shipment.cargo}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {shipment.business}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {shipment.route}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {shipment.method}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                        shipment.status
                      )}`}
                    >
                      {shipment.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-700">
                    {shipment.cost}
                  </td>

                  <td className="px-6 py-4">

                    <select
                      value={shipment.status}
                      onChange={(e) =>
                        updateStatus(
                          shipment.id,
                          e.target.value
                        )
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                      <option>Pending</option>
                      <option>In Transit</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  )
}

export default Shipments