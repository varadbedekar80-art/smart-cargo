import { useState } from 'react'

function Reports() {
  const [reportType, setReportType] = useState('Shipments')

  const shipmentStats = {
    total: 24,
    active: 8,
    pending: 5,
    completed: 10,
    cancelled: 1,
  }

  const methodStats = [
    { method: 'Air', shipments: 12, percentage: 50 },
    { method: 'Sea', shipments: 7, percentage: 29 },
    { method: 'Road', shipments: 5, percentage: 21 },
  ]

  const monthlyData = [
    { month: 'May', shipments: 3 },
    { month: 'June', shipments: 5 },
    { month: 'July', shipments: 4 },
    { month: 'August', shipments: 6 },
    { month: 'September', shipments: 6 },
  ]

  const recentReports = [
    {
      id: 'SC-10024',
      route: 'Mumbai → Dubai',
      method: 'Air',
      status: 'In Transit',
      cost: '$2,450',
    },
    {
      id: 'SC-10023',
      route: 'Pune → Singapore',
      method: 'Sea',
      status: 'Pending',
      cost: '$1,850',
    },
    {
      id: 'SC-10022',
      route: 'Nashik → London',
      method: 'Air',
      status: 'Completed',
      cost: '$3,200',
    },
  ]

  const maxMonthlyShipments = Math.max(
    ...monthlyData.map((item) => item.shipments)
  )

  return (
    <div>

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Reports
          </h1>

          <p className="mt-2 text-slate-500">
            View shipment statistics and logistics performance.
          </p>
        </div>

        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
        >
          <option>Shipments</option>
          <option>Payments</option>
          <option>Documents</option>
        </select>

      </div>

      {/* Shipment Summary */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Shipments
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {shipmentStats.total}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Active
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {shipmentStats.active}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Pending
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {shipmentStats.pending}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Completed
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {shipmentStats.completed}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Cancelled
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {shipmentStats.cancelled}
          </p>
        </div>

      </div>

      {/* Main Reports */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Shipment Status */}
        <div className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-800">
            Shipment Status
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current shipment distribution
          </p>

          <div className="mt-6 space-y-5">

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Active</span>
                <span className="font-medium">
                  {shipmentStats.active}
                </span>
              </div>

              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-blue-500"
                  style={{
                    width: `${(shipmentStats.active / shipmentStats.total) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Pending</span>
                <span className="font-medium">
                  {shipmentStats.pending}
                </span>
              </div>

              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-yellow-500"
                  style={{
                    width: `${(shipmentStats.pending / shipmentStats.total) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Completed</span>
                <span className="font-medium">
                  {shipmentStats.completed}
                </span>
              </div>

              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-green-500"
                  style={{
                    width: `${(shipmentStats.completed / shipmentStats.total) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Cancelled</span>
                <span className="font-medium">
                  {shipmentStats.cancelled}
                </span>
              </div>

              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-red-500"
                  style={{
                    width: `${(shipmentStats.cancelled / shipmentStats.total) * 100}%`,
                  }}
                />
              </div>
            </div>

          </div>

        </div>

        {/* Transport Methods */}
        <div className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-800">
            Transport Methods
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Shipment distribution by transport method
          </p>

          <div className="mt-6 space-y-5">

            {methodStats.map((item) => (
              <div key={item.method}>

                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">
                    {item.method}
                  </span>

                  <span className="text-slate-500">
                    {item.shipments} shipments ({item.percentage}%)
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-100">

                  <div
                    className="h-3 rounded-full bg-slate-700"
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

      {/* Monthly Shipment Report */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

        <h2 className="text-xl font-semibold text-slate-800">
          Monthly Shipments
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Shipment activity over the last five months
        </p>

        <div className="mt-6 space-y-5">

          {monthlyData.map((item) => (
            <div key={item.month}>

              <div className="mb-2 flex justify-between text-sm">

                <span className="font-medium">
                  {item.month}
                </span>

                <span className="text-slate-500">
                  {item.shipments} shipments
                </span>

              </div>

              <div className="h-4 rounded-full bg-slate-100">

                <div
                  className="h-4 rounded-full bg-blue-600"
                  style={{
                    width: `${(item.shipments / maxMonthlyShipments) * 100}%`,
                  }}
                />

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* Recent Shipment Report */}
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="border-b border-slate-200 p-6">

          <h2 className="text-xl font-semibold text-slate-800">
            Recent Shipment Report
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest shipment activity
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr className="text-left text-sm text-slate-500">

                <th className="px-6 py-4">Tracking ID</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Cost</th>

              </tr>

            </thead>

            <tbody>

              {recentReports.map((report) => (

                <tr
                  key={report.id}
                  className="border-t border-slate-100"
                >

                  <td className="px-6 py-4 font-medium text-slate-800">
                    {report.id}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {report.route}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {report.method}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        report.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : report.status === 'In Transit'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {report.status}
                    </span>

                  </td>

                  <td className="px-6 py-4 font-medium text-slate-800">
                    {report.cost}
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

export default Reports