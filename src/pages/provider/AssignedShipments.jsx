import { useState } from 'react'

function AssignedShipments() {
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
      tracking: 'SC-10021',
      cargo: 'Automobile Parts',
      business: 'Metro Auto Exports',
      route: 'Mumbai → Hamburg',
      method: 'Sea',
      status: 'Pickup Pending',
      cost: '$2,780',
    },
    {
      id: 3,
      tracking: 'SC-10018',
      cargo: 'Textile Products',
      business: 'Cotton Exporters Ltd.',
      route: 'Pune → Singapore',
      method: 'Sea',
      status: 'Delivered',
      cost: '$1,950',
    },
  ])

  const getStatusStyle = (status) => {
    if (status === 'Delivered') {
      return 'bg-green-100 text-green-700'
    }

    if (status === 'In Transit') {
      return 'bg-blue-100 text-blue-700'
    }

    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Assigned Shipments
        </h1>

        <p className="mt-2 text-slate-500">
          View and manage shipments assigned to your logistics company.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Assigned
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {shipments.length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            In Transit
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {
              shipments.filter(
                (shipment) => shipment.status === 'In Transit'
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Delivered
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {
              shipments.filter(
                (shipment) => shipment.status === 'Delivered'
              ).length
            }
          </p>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-800">
            My Assigned Shipments
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
                  Cost
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Status
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

                  <td className="px-6 py-4 font-medium text-slate-700">
                    {shipment.cost}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AssignedShipments