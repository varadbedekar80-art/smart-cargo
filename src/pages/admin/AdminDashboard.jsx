function AdminDashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Administrator Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor users, businesses, shipments, documents, and payments.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Users
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            128
          </p>

          <p className="mt-2 text-sm text-green-600">
            +12 this month
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Businesses
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            74
          </p>

          <p className="mt-2 text-sm text-blue-600">
            68 Active
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Shipments
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            246
          </p>

          <p className="mt-2 text-sm text-orange-600">
            38 In Transit
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Pending Payments
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            14
          </p>

          <p className="mt-2 text-sm text-red-600">
            Requires attention
          </p>
        </div>

      </div>

      {/* Main Sections */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        {/* Shipment Overview */}
        <div className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-800">
            Shipment Overview
          </h2>

          <div className="mt-6 space-y-5">

            <div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">
                  Pending
                </span>

                <span className="font-medium">
                  42
                </span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div className="h-2 w-[35%] rounded-full bg-yellow-400"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">
                  In Transit
                </span>

                <span className="font-medium">
                  38
                </span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div className="h-2 w-[45%] rounded-full bg-blue-500"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">
                  Completed
                </span>

                <span className="font-medium">
                  152
                </span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div className="h-2 w-[75%] rounded-full bg-green-500"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">
                  Cancelled
                </span>

                <span className="font-medium">
                  14
                </span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div className="h-2 w-[15%] rounded-full bg-red-400"></div>
              </div>
            </div>

          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-800">
            Recent Activity
          </h2>

          <div className="mt-5 space-y-4">

            <div className="border-b pb-4">
              <p className="font-medium text-slate-800">
                New business registered
              </p>

              <p className="text-sm text-slate-500">
                ABC Electronics Pvt. Ltd.
              </p>

              <p className="mt-1 text-xs text-slate-400">
                10 minutes ago
              </p>
            </div>

            <div className="border-b pb-4">
              <p className="font-medium text-slate-800">
                Shipment created
              </p>

              <p className="text-sm text-slate-500">
                Shipment SC-10024
              </p>

              <p className="mt-1 text-xs text-slate-400">
                1 hour ago
              </p>
            </div>

            <div className="border-b pb-4">
              <p className="font-medium text-slate-800">
                Document submitted
              </p>

              <p className="text-sm text-slate-500">
                Packing List for SC-10023
              </p>

              <p className="mt-1 text-xs text-slate-400">
                2 hours ago
              </p>
            </div>

            <div>
              <p className="font-medium text-slate-800">
                Payment received
              </p>

              <p className="text-sm text-slate-500">
                Transaction TXN-50021
              </p>

              <p className="mt-1 text-xs text-slate-400">
                3 hours ago
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

        <h2 className="text-xl font-semibold text-slate-800">
          Quick Actions
        </h2>

        <div className="mt-5 flex flex-wrap gap-3">

          <button className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700">
            Manage Users
          </button>

          <button className="rounded-lg bg-slate-100 px-5 py-3 font-medium text-slate-700 hover:bg-slate-200">
            Review Documents
          </button>

          <button className="rounded-lg bg-slate-100 px-5 py-3 font-medium text-slate-700 hover:bg-slate-200">
            View Shipments
          </button>

          <button className="rounded-lg bg-slate-100 px-5 py-3 font-medium text-slate-700 hover:bg-slate-200">
            Manage Providers
          </button>

        </div>

      </div>
    </div>
  )
}

export default AdminDashboard