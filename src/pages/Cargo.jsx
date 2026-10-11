
import { useEffect, useMemo, useState } from 'react'

const API_URL = 'https://smart-cargo.onrender.com/api/cargo'

const initialFormData = {
  name: '',
  category: '',
  quantity: '1',
  weight: '',
  dimensions: '',
  packageType: '',
  packages: '1',
  value: '',
  currency: 'USD',
}

const categories = [
  'Electronics',
  'Textiles',
  'Food & Beverages',
  'Machinery',
  'Chemicals',
  'Furniture',
  'Agricultural Products',
  'Other',
]

function Cargo() {
  const [cargoItems, setCargoItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [formData, setFormData] = useState(initialFormData)

  const getToken = () => localStorage.getItem('token')

  const fetchCargo = async () => {
    setLoading(true)
    setError('')

    try {
      const token = getToken()

      if (!token) {
        setError('Please log in to view your cargo.')
        return
      }

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load cargo.')
      }

      setCargoItems(Array.isArray(data) ? data : data.cargo || [])
    } catch (err) {
      setError(err.message || 'Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCargo()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData({ ...initialFormData })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const quantity = Number(formData.quantity)
    const weight = Number(formData.weight)
    const packages = Number(formData.packages)
    const declaredValue = Number(formData.value)

    if (!formData.name.trim()) {
      setError('Please enter the product name.')
      return
    }

    if (!formData.category) {
      setError('Please select a cargo category.')
      return
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      setError('Quantity must be a whole number greater than zero.')
      return
    }

    if (!Number.isFinite(weight) || weight <= 0) {
      setError('Weight must be greater than zero.')
      return
    }

    if (!Number.isInteger(packages) || packages < 1) {
      setError('Number of packages must be a whole number greater than zero.')
      return
    }

    if (!Number.isFinite(declaredValue) || declaredValue < 0) {
      setError('Declared value cannot be negative.')
      return
    }

    try {
      setSaving(true)

      const token = getToken()

      if (!token) {
        throw new Error('Please log in before adding cargo.')
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_name: formData.name.trim(),
          category: formData.category,
          quantity,
          weight,
          dimensions: formData.dimensions.trim(),
          package_type: formData.packageType,
          number_of_packages: packages,
          declared_value: declaredValue,
          currency: formData.currency,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add cargo.')
      }

      if (data.cargo?.id) {
        setCargoItems((previous) => [data.cargo, ...previous])
      } else {
        await fetchCargo()
      }

      setShowModal(false)
      resetForm()
      setSuccess('Cargo added successfully.')
    } catch (err) {
      setError(err.message || 'Unable to add cargo.')
    } finally {
      setSaving(false)
    }
  }

  const filteredCargo = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    return cargoItems.filter((item) => {
      const matchesSearch =
        (item.product_name || '').toLowerCase().includes(search) ||
        (item.category || '').toLowerCase().includes(search)

      const matchesCategory =
        selectedCategory === 'All' ||
        item.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [cargoItems, searchTerm, selectedCategory])

  const totalWeight = cargoItems.reduce(
    (total, item) => total + Number(item.weight || 0),
    0
  )

  const totalPackages = cargoItems.reduce(
    (total, item) => total + Number(item.number_of_packages || 0),
    0
  )

  const totalDeclaredValue = cargoItems.reduce(
    (total, item) => total + Number(item.declared_value || 0),
    0
  )

  const closeModal = () => {
    if (saving) return
    setShowModal(false)
    resetForm()
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Cargo Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your cargo details and prepare for shipment creation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          + Add Cargo
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && !showModal && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          <button
            type="button"
            onClick={fetchCargo}
            className="ml-3 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Cargo Items</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {cargoItems.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Weight</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {totalWeight.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}{' '}
            <span className="text-base font-medium">kg</span>
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Packages</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {totalPackages}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Declared Value</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {totalDeclaredValue.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}{' '}
            <span className="text-base font-medium">USD*</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">
            *Displayed as a simple total; cargo currencies may differ.
          </p>
        </div>
      </div>

      {/* Cargo List */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-bold text-slate-800">Cargo Inventory</h2>
          <p className="mt-1 text-sm text-slate-500">
            View and search your saved cargo items.
          </p>

          <div className="mt-5 flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by product name or category..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 md:w-64"
            >
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            Loading cargo...
          </div>
        ) : filteredCargo.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mb-3 text-4xl">📦</div>
            <h3 className="font-semibold text-slate-800">
              {cargoItems.length === 0
                ? 'No cargo added yet'
                : 'No matching cargo found'}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {cargoItems.length === 0
                ? 'Add your first cargo item to get started.'
                : 'Try a different search term or category.'}
            </p>

            {cargoItems.length === 0 && (
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setShowModal(true)
                }}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
              >
                Add Your First Cargo
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Product</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Quantity</th>
                  <th className="px-5 py-4 font-semibold">Weight</th>
                  <th className="px-5 py-4 font-semibold">Packages</th>
                  <th className="px-5 py-4 font-semibold">Declared Value</th>
                  <th className="px-5 py-4 font-semibold">Package Type</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCargo.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {item.product_name}
                      {item.dimensions && (
                        <p className="mt-1 text-xs text-slate-400">
                          Dimensions: {item.dimensions}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item.category}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item.quantity}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {Number(item.weight).toLocaleString()} kg
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item.number_of_packages}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item.currency || 'USD'}{' '}
                      {Number(item.declared_value).toLocaleString()}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item.package_type || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-500">
          Showing {filteredCargo.length} of {cargoItems.length} cargo items
        </div>
      </div>

      {/* Add Cargo Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal()
          }}
        >
          <div className="my-auto w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Add Cargo Item
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the details of the cargo you want to ship.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close modal"
                className="rounded-lg px-3 py-2 text-2xl text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">
                    {error}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={150}
                    placeholder="e.g. Electronic Components"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    step="1"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Total Weight (kg) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    required
                    placeholder="e.g. 250"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Enter the total cargo weight in kilograms.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    placeholder="e.g. 100 × 80 × 60 cm"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Package Type
                  </label>
                  <select
                    name="packageType"
                    value={formData.packageType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="">Select package type</option>
                    <option value="Box">Box</option>
                    <option value="Pallet">Pallet</option>
                    <option value="Crate">Crate</option>
                    <option value="Container">Container</option>
                    <option value="Bag">Bag</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Number of Packages *
                  </label>
                  <input
                    type="number"
                    name="packages"
                    value={formData.packages}
                    onChange={handleChange}
                    min="1"
                    step="1"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Declared Value *
                  </label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    placeholder="Enter cargo value"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Currency *
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>

                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 md:col-span-2">
                  <p className="text-sm font-semibold text-blue-800">
                    Shipping cost estimation
                  </p>
                  <p className="mt-1 text-sm text-blue-700">
                    The cargo weight entered here can be used to estimate
                    shipping costs after a logistics provider and its price
                    per kilogram are selected.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Cargo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cargo
