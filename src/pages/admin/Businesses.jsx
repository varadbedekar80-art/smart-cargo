import { useState } from 'react'

function Businesses() {
  const [businesses, setBusinesses] = useState([
    {
      id: 1,
      name: 'ABC Electronics Pvt. Ltd.',
      owner: 'Rahul Sharma',
      email: 'rahul@abcelectronics.com',
      type: 'Electronics Exporter',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Cotton Exporters Ltd.',
      owner: 'Priya Mehta',
      email: 'priya@textileexports.com',
      type: 'Textile Exporter',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Industrial Parts Co.',
      owner: 'Sneha Kulkarni',
      email: 'sneha@machinelogistics.com',
      type: 'Machinery Exporter',
      status: 'Inactive',
    },
  ])

  const toggleStatus = (id) => {
    setBusinesses(
      businesses.map((business) =>
        business.id === id
          ? {
              ...business,
              status:
                business.status === 'Active'
                  ? 'Inactive'
                  : 'Active',
            }
          : business
      )
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Business Management
        </h1>

        <p className="mt-2 text-slate-500">
          View and manage registered businesses.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-5 md:grid-cols-3">

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Businesses
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {businesses.length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Active Businesses
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {businesses.filter(
              (business) => business.status === 'Active'
            ).length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Inactive Businesses
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {businesses.filter(
              (business) => business.status === 'Inactive'
            ).length}
          </p>
        </div>

      </div>

      {/* Businesses Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-800">
            Registered Businesses
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">
              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Business
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Owner
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Business Type
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Action
                </th>

              </tr>
            </thead>

            <tbody className="divide-y">

              {businesses.map((business) => (
                <tr
                  key={business.id}
                  className="hover:bg-slate-50"
                >

                  <td className="px-6 py-4 font-medium text-slate-800">
                    {business.name}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {business.owner}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {business.email}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {business.type}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        business.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {business.status}
                    </span>

                  </td>

                  <td className="px-6 py-4">

                    <button
                      onClick={() => toggleStatus(business.id)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
                    >
                      {business.status === 'Active'
                        ? 'Deactivate'
                        : 'Activate'}
                    </button>

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

export default Businesses