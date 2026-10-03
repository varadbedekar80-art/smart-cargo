import { useEffect, useState } from 'react'

function Reports() {
  const [reportType, setReportType] = useState('Shipments')
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchShipments()
  }, [])

  const fetchShipments = async () => {
    try {
      setLoading(true)

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
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  // ==============================
  // SHIPMENT STATISTICS
  // ==============================

  const totalShipments = shipments.length

  const activeShipments = shipments.filter(
    (shipment) =>
      shipment.status === 'In Transit' ||
      shipment.status === 'Picked Up'
  ).length

  const pendingShipments = shipments.filter(
    (shipment) =>
      shipment.status === 'Pending'
  ).length

  const completedShipments = shipments.filter(
    (shipment) =>
      shipment.status === 'Completed' ||
      shipment.status === 'Delivered'
  ).length

  const cancelledShipments = shipments.filter(
    (shipment) =>
      shipment.status === 'Cancelled'
  ).length

  const shipmentStats = {
    total: totalShipments,
    active: activeShipments,
    pending: pendingShipments,
    completed: completedShipments,
    cancelled: cancelledShipments,
  }

  // ==============================
  // TRANSPORT METHOD STATISTICS
  // ==============================

  const methods = ['Air', 'Sea', 'Road']

  const methodStats = methods.map((method) => {
    const count = shipments.filter(
      (shipment) =>
        shipment.shipping_method === method
    ).length

    const percentage =
      totalShipments > 0
        ? Math.round(
            (count / totalShipments) * 100
          )
        : 0

    return {
      method,
      shipments: count,
      percentage,
    }
  })

  // ==============================
  // MONTHLY DATA
  // ==============================

  const getLastFiveMonths = () => {
    const months = []

    const now = new Date()

    for (let i = 4; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      )

      months.push({
        month: date.toLocaleDateString(
          'en-IN',
          {
            month: 'long',
          }
        ),
        monthNumber: date.getMonth(),
        year: date.getFullYear(),
      })
    }

    return months
  }

  const monthlyData = getLastFiveMonths().map(
    (month) => {
      const count = shipments.filter(
        (shipment) => {
          if (!shipment.created_at) {
            return false
          }

          const date = new Date(
            shipment.created_at
          )

          return (
            date.getMonth() ===
              month.monthNumber &&
            date.getFullYear() ===
              month.year
          )
        }
      ).length

      return {
        month: month.month,
        shipments: count,
      }
    }
  )

  const maxMonthlyShipments = Math.max(
    ...monthlyData.map(
      (item) => item.shipments
    ),
    1
  )

  // ==============================
  // RECENT SHIPMENTS
  // ==============================

  const recentReports = shipments
    .slice(0, 5)
    .map((shipment) => ({
      id: shipment.shipment_number,
      route: `${shipment.origin} → ${shipment.destination}`,
      method: shipment.shipping_method,
      status: shipment.status,
      cost:
        shipment.estimated_cost != null
          ? `${shipment.currency || 'USD'} ${Number(
              shipment.estimated_cost
            ).toLocaleString()}`
          : 'Not estimated',
    }))

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
          onChange={(e) =>
            setReportType(e.target.value)
          }
          className="rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
        >
          <option>Shipments</option>
          <option>Payments</option>
          <option>Documents</option>
        </select>

      </div>

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center text-slate-500 shadow-sm">
          Loading reports...
        </div>
      ) : reportType === 'Shipments' ? (

        <>
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

                {[
                  {
                    name: 'Active',
                    value: shipmentStats.active,
                    className: 'bg-blue-500',
                  },
                  {
                    name: 'Pending',
                    value: shipmentStats.pending,
                    className: 'bg-yellow-500',
                  },
                  {
                    name: 'Completed',
                    value: shipmentStats.completed,
                    className: 'bg-green-500',
                  },
                  {
                    name: 'Cancelled',
                    value: shipmentStats.cancelled,
                    className: 'bg-red-500',
                  },
                ].map((item) => (

                  <div key={item.name}>

                    <div className="mb-2 flex justify-between text-sm">

                      <span>
                        {item.name}
                      </span>

                      <span className="font-medium">
                        {item.value}
                      </span>

                    </div>

                    <div className="h-3 rounded-full bg-slate-100">

                      <div
                        className={`h-3 rounded-full ${item.className}`}
                        style={{
                          width:
                            totalShipments > 0
                              ? `${(item.value / totalShipments) * 100}%`
                              : '0%',
                        }}
                      />

                    </div>

                  </div>

                ))}

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
                        {item.shipments} shipments (
                        {item.percentage}
                        %)
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
                        width: `${
                          (item.shipments /
                            maxMonthlyShipments) *
                          100
                        }%`,
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

              {recentReports.length === 0 ? (

                <div className="p-8 text-center text-slate-500">
                  No shipments found.
                </div>

              ) : (

                <table className="w-full">

                  <thead className="bg-slate-50">

                    <tr className="text-left text-sm text-slate-500">

                      <th className="px-6 py-4">
                        Shipment ID
                      </th>

                      <th className="px-6 py-4">
                        Route
                      </th>

                      <th className="px-6 py-4">
                        Method
                      </th>

                      <th className="px-6 py-4">
                        Status
                      </th>

                      <th className="px-6 py-4">
                        Cost
                      </th>

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
                                  : report.status === 'Cancelled'
                                    ? 'bg-red-100 text-red-700'
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

              )}

            </div>

          </div>

        </>

      ) : (

        <div className="rounded-xl bg-white p-10 text-center shadow-sm">

          <h2 className="text-xl font-semibold text-slate-800">
            {reportType} Reports
          </h2>

          <p className="mt-2 text-slate-500">
            This report section will be connected to the
            database next.
          </p>

        </div>

      )}

    </div>
  )
}

export default Reports