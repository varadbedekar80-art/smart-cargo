import { useEffect, useState } from 'react'

function Providers() {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProvider, setEditingProvider] = useState(null)

  const [form, setForm] = useState({
    name: '',
    service_type: 'Air',
    contact_email: '',
    phone: '',
    location: '',
    coverage: 'International',
    status: 'Active',
  })

  const token = localStorage.getItem('token')

  const fetchProviders = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        'https://smart-cargo.onrender.com/api/admin/providers',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load providers')
      }

      setProviders(data)
    } catch (error) {
      console.error('ADMIN PROVIDERS ERROR:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProviders()
  }, [])

  const resetForm = () => {
    setForm({
      name: '',
      service_type: 'Air',
      contact_email: '',
      phone: '',
      location: '',
      coverage: 'International',
      status: 'Active',
    })

    setEditingProvider(null)
    setShowForm(false)
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const url = editingProvider
        ? `https://smart-cargo.onrender.com/api/admin/providers/${editingProvider.id}`
        : 'https://smart-cargo.onrender.com/api/admin/providers'

      const response = await fetch(url, {
        method: editingProvider ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to save provider'
        )
      }

      if (editingProvider) {
        setProviders((current) =>
          current.map((provider) =>
            provider.id === editingProvider.id
              ? data.provider
              : provider
          )
        )
      } else {
        setProviders((current) => [
          data.provider,
          ...current,
        ])
      }

      resetForm()
    } catch (error) {
      console.error('SAVE PROVIDER ERROR:', error)
      alert(error.message)
    }
  }

  const handleEdit = (provider) => {
    setEditingProvider(provider)

    setForm({
      name: provider.name || '',
      service_type: provider.service_type || 'Air',
      contact_email: provider.contact_email || '',
      phone: provider.phone || '',
      location: provider.location || '',
      coverage: provider.coverage || 'International',
      status: provider.status || 'Active',
    })

    setShowForm(true)
  }

  const handleDelete = async (providerId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this logistics provider?'
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `https://smart-cargo.onrender.com/api/admin/providers/${providerId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to delete provider'
        )
      }

      setProviders((current) =>
        current.filter(
          (provider) => provider.id !== providerId
        )
      )
    } catch (error) {
      console.error('DELETE PROVIDER ERROR:', error)
      alert(error.message)
    }
  }

  const activeCount = providers.filter(
    (provider) => provider.status === 'Active'
  ).length

  const inactiveCount = providers.filter(
    (provider) => provider.status === 'Inactive'
  ).length

  const airCount = providers.filter(
    (provider) => provider.service_type === 'Air'
  ).length

  const seaCount = providers.filter(
    (provider) => provider.service_type === 'Sea'
  ).length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Logistics Providers
          </h1>

          <p className="mt-2 text-gray-500">
            Manage logistics providers available on the platform.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProvider(null)
            setForm({
              name: '',
              service_type: 'Air',
              contact_email: '',
              phone: '',
              location: '',
              coverage: 'International',
              status: 'Active',
            })
            setShowForm(true)
          }}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          + Add Provider
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500">
            Total Providers
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {providers.length}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500">
            Active
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {activeCount}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500">
            Inactive
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {inactiveCount}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500">
            Air / Sea
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {airCount} / {seaCount}
          </h2>
        </div>
      </div>

      {showForm && (
        <div className="mb-8 rounded-xl bg-white border shadow-sm">
          <div className="flex items-center justify-between border-b p-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {editingProvider
                  ? 'Edit Provider'
                  : 'Add Provider'}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter logistics provider information.
              </p>
            </div>

            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Provider Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Enter provider name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Service Type
              </label>

              <select
                name="service_type"
                value={form.service_type}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="Air">Air</option>
                <option value="Sea">Sea</option>
                <option value="Road">Road</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Contact Email
              </label>

              <input
                type="email"
                name="contact_email"
                value={form.contact_email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                placeholder="provider@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Mumbai, India"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Coverage
              </label>

              <select
                name="coverage"
                value={form.coverage}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="International">
                  International
                </option>
                <option value="Domestic">
                  Domestic
                </option>
              </select>
            </div>

            {editingProvider && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            )}

            <div className="flex items-end gap-3">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
              >
                {editingProvider
                  ? 'Update Provider'
                  : 'Add Provider'}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-xl bg-white shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            All Logistics Providers
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add, edit, activate, deactivate or remove providers.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading providers...
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="font-medium text-red-600">
              {error}
            </p>

            <button
              onClick={fetchProviders}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : providers.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No logistics providers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Provider
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Service
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Location
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Coverage
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {providers.map((provider) => (
                  <tr
                    key={provider.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">
                        {provider.name}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {provider.service_type}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-gray-700">
                        {provider.contact_email}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {provider.phone}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {provider.location}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {provider.coverage}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          provider.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {provider.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleEdit(provider)
                          }
                          className="rounded-lg border border-blue-200 px-3 py-2 text-blue-600 hover:bg-blue-50"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(provider.id)
                          }
                          className="rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Providers