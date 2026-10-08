import { useEffect, useState } from 'react'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          'https://smart-cargo.onrender.com/api/users',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch users')
        }

        setUsers(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('GET USERS ERROR:', error)
        setError(error.message || 'Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [token])

  const toggleStatus = async (user) => {
  const newStatus =
    user.status === 'Active'
      ? 'Inactive'
      : 'Active'

  try {
    const response = await fetch(
      `https://smart-cargo.onrender.com/api/users/${user.id}/status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.message || 'Failed to update user status'
      )
    }

    setUsers((currentUsers) =>
      currentUsers.map((currentUser) =>
        currentUser.id === user.id
          ? {
              ...currentUser,
              status: data.user.status,
            }
          : currentUser
      )
    )

  } catch (error) {
    console.error('UPDATE USER STATUS ERROR:', error)

    alert(error.message || 'Failed to update user status')
  }
}

  const activeUsers = users.filter(
    (user) => user.status === 'Active'
  ).length

  const inactiveUsers = users.filter(
    (user) => user.status === 'Inactive'
  ).length

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-500">
          Loading users...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-red-600">
          Failed to load users
        </h1>

        <p className="mt-2 text-slate-500">
          {error}
        </p>
      </div>
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
            {activeUsers}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Inactive Users
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {inactiveUsers}
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

              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
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
  onClick={() => toggleStatus(user)}
  className={`rounded-lg border px-3 py-2 text-sm font-medium ${
    user.status === 'Active'
      ? 'border-red-300 text-red-600 hover:bg-red-50'
      : 'border-green-300 text-green-600 hover:bg-green-50'
  }`}
>
  {user.status === 'Active'
    ? 'Deactivate'
    : 'Activate'}
</button>
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  )
}

export default Users