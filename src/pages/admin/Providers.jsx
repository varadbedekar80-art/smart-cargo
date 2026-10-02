import { useState } from 'react'

function Providers() {
  const [providers, setProviders] = useState([
    {
      id: 1,
      name: 'Global Express',
      type: 'International Logistics',
      services: 'Air, Sea, Road',
      contact: 'support@globalexpress.com',
      phone: '+91 98765 11111',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Ocean Logistics',
      type: 'Freight Forwarding',
      services: 'Sea, Road',
      contact: 'info@oceanlogistics.com',
      phone: '+91 98765 22222',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Swift Cargo',
      type: 'Cargo & Freight',
      services: 'Air, Road',
      contact: 'contact@swiftcargo.com',
      phone: '+91 98765 33333',
      status: 'Inactive',
    },
    {
      id: 4,
      name: 'Metro Freight',
      type: 'Logistics Provider',
      services: 'Air, Sea',
      contact: 'info@metrofreight.com',
      phone: '+91 98765 44444',
      status: 'Active',
    },
  ])

  const updateStatus = (id, newStatus) => {
    setProviders(
      providers.map((provider) =>
        provider.id === id
          ? { ...provider, status: newStatus }
          : provider
      )
    )
  }

  const getStatusStyle = (status) => {
    return status === 'Active'
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700'
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Logistics Provider Management
        </h1>

        <p className="mt-2 text-slate-500">
          Manage logistics providers and their platform access.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Providers
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {providers.length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Active Providers
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {
              providers.filter(
                (provider) => provider.status === 'Active'
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Inactive Providers
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {
              providers.filter(
                (provider) => provider.status === 'Inactive'
              ).length
            }
          </p>
        </div>
      </div>

      {/* Providers Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-800">
            All Logistics Providers
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Provider
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Type
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Services
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Contact
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Phone
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
              {providers.map((provider) => (
                <tr
                  key={provider.id}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">
                      {provider.name}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {provider.type}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {provider.services}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {provider.contact}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {provider.phone}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                        provider.status
                      )}`}
                    >
                      {provider.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={provider.status}
                      onChange={(e) =>
                        updateStatus(
                          provider.id,
                          e.target.value
                        )
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                      <option>Active</option>
                      <option>Inactive</option>
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

export default Providers