import { useState } from 'react'

function Users() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul@abcelectronics.com',
      role: 'Business User',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Priya Mehta',
      email: 'priya@textileexports.com',
      role: 'Business User',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Amit Patel',
      email: 'amit@swiftcargo.com',
      role: 'Logistics Provider',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Sneha Kulkarni',
      email: 'sneha@machinelogistics.com',
      role: 'Business User',
      status: 'Inactive',
    },
  ])

  const toggleStatus = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === 'Active'
                  ? 'Inactive'
                  : 'Active',
            }
          : user
      )
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          User Management
        </h1>

        <p className="mt-2 text-slate-500">
          Manage registered users and their account status.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid gap-5 md:grid-cols-3">

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Users
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {users.length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Active Users
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {users.filter(
              (user) => user.status === 'Active'
            ).length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Inactive Users
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {users.filter(
              (user) => user.status === 'Inactive'
            ).length}
          </p>
        </div>

      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-800">
            Registered Users
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">
              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Name
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Role
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

              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50"
                >

                  <td className="px-6 py-4 font-medium text-slate-800">
                    {user.name}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">

                    <button
                      onClick={() => toggleStatus(user.id)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
                    >
                      {user.status === 'Active'
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

export default Users