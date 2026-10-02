function Dashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Provider Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your assigned shipments and delivery operations.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Assigned Shipments
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            12
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Pending Pickup
          </p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            3
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            In Transit
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            6
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Delivered
          </p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            3
          </p>
        </div>
      </div>

      {/* Current Operations */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">
            Current Operations
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div>
                <p className="font-medium text-slate-800">
                  SC-10024
                </p>
                <p className="text-sm text-slate-500">
                  Mumbai → Dubai
                </p>
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                In Transit
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div>
                <p className="font-medium text-slate-800">
                  SC-10021
                </p>
                <p className="text-sm text-slate-500">
                  Mumbai → Hamburg
                </p>
              </div>

              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                Pickup Pending
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div>
                <p className="font-medium text-slate-800">
                  SC-10018
                </p>
                <p className="text-sm text-slate-500">
                  Pune → Singapore
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Delivered
              </span>
            </div>
          </div>
        </div>

        {/* Provider Information */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">
            Provider Information
          </h2>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm text-slate-500">
                Company
              </p>
              <p className="mt-1 font-medium text-slate-800">
                Global Express
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Provider Type
              </p>
              <p className="mt-1 font-medium text-slate-800">
                International Logistics
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Services
              </p>
              <p className="mt-1 font-medium text-slate-800">
                Air, Sea, Road
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Status
              </p>

              <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Shipments */}
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-800">
            Recent Assigned Shipments
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
                  Route
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Method
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-blue-600">
                  SC-10024
                </td>

                <td className="px-6 py-4 text-slate-700">
                  Electronic Components
                </td>

                <td className="px-6 py-4 text-slate-600">
                  Mumbai → Dubai
                </td>

                <td className="px-6 py-4 text-slate-600">
                  Air
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    In Transit
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-blue-600">
                  SC-10021
                </td>

                <td className="px-6 py-4 text-slate-700">
                  Automobile Parts
                </td>

                <td className="px-6 py-4 text-slate-600">
                  Mumbai → Hamburg
                </td>

                <td className="px-6 py-4 text-slate-600">
                  Sea
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                    Pickup Pending
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-blue-600">
                  SC-10018
                </td>

                <td className="px-6 py-4 text-slate-700">
                  Textile Products
                </td>

                <td className="px-6 py-4 text-slate-600">
                  Pune → Singapore
                </td>

                <td className="px-6 py-4 text-slate-600">
                  Sea
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Delivered
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard