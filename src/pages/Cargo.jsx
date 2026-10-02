import { useState } from 'react'

function Cargo() {
  const [cargoItems, setCargoItems] = useState([
    {
      id: 1,
      name: 'Electronic Components',
      category: 'Electronics',
      quantity: 120,
      weight: '350 kg',
      dimensions: '40 × 30 × 25 cm',
      packageType: 'Box',
      packages: 12,
      value: '18500',
      currency: 'USD',
    },
    {
      id: 2,
      name: 'Cotton Textiles',
      category: 'Textiles',
      quantity: 80,
      weight: '500 kg',
      dimensions: '60 × 40 × 30 cm',
      packageType: 'Bale',
      packages: 20,
      value: '12000',
      currency: 'USD',
    },
    {
      id: 3,
      name: 'Machine Parts',
      category: 'Machinery',
      quantity: 45,
      weight: '720 kg',
      dimensions: '80 × 50 × 45 cm',
      packageType: 'Crate',
      packages: 9,
      value: '25800',
      currency: 'USD',
    },
  ])

  const [showModal, setShowModal] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    weight: '',
    dimensions: '',
    packageType: '',
    packages: '',
    value: '',
    currency: 'USD',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newCargo = {
      id: Date.now(),
      ...formData,
      weight: `${formData.weight} kg`,
    }

    setCargoItems([...cargoItems, newCargo])

    setFormData({
      name: '',
      category: '',
      quantity: '',
      weight: '',
      dimensions: '',
      packageType: '',
      packages: '',
      value: '',
      currency: 'USD',
    })

    setShowModal(false)
  }

  const handleDelete = (id) => {
    setCargoItems(
      cargoItems.filter((cargo) => cargo.id !== id)
    )
  }

  return (
    <div>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h3 className="text-2xl font-bold">
            Cargo Management
          </h3>

          <p className="text-slate-500 mt-1">
            Manage your cargo items and shipment details.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium"
        >
          + Add Cargo
        </button>

      </div>


      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Search cargo..."
            className="flex-1 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select className="border border-slate-200 rounded-lg px-4 py-3">

            <option>All Categories</option>
            <option>Electronics</option>
            <option>Textiles</option>
            <option>Machinery</option>
            <option>Food</option>

          </select>

        </div>

      </div>


      {/* Cargo Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        <div className="p-6 border-b">

          <h4 className="text-lg font-bold">
            Cargo Items
          </h4>

          <p className="text-sm text-slate-500 mt-1">
            {cargoItems.length} cargo items found
          </p>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="text-left px-6 py-4 text-sm">
                  Product
                </th>

                <th className="text-left px-6 py-4 text-sm">
                  Category
                </th>

                <th className="text-left px-6 py-4 text-sm">
                  Quantity
                </th>

                <th className="text-left px-6 py-4 text-sm">
                  Weight
                </th>

                <th className="text-left px-6 py-4 text-sm">
                  Packages
                </th>

                <th className="text-left px-6 py-4 text-sm">
                  Declared Value
                </th>

                <th className="text-left px-6 py-4 text-sm">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {cargoItems.map((cargo) => (

                <tr
                  key={cargo.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-6 py-4 font-medium">
                    {cargo.name}
                  </td>

                  <td className="px-6 py-4">
                    {cargo.category}
                  </td>

                  <td className="px-6 py-4">
                    {cargo.quantity}
                  </td>

                  <td className="px-6 py-4">
                    {cargo.weight}
                  </td>

                  <td className="px-6 py-4">
                    {cargo.packages}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {cargo.currency} {cargo.value}
                  </td>

                  <td className="px-6 py-4">

                    <button
                      onClick={() => handleDelete(cargo.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* Add Cargo Modal */}
      {showModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">

              <div>
                <h3 className="text-xl font-bold">
                  Add Cargo
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Enter the details of your cargo.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-slate-800 text-xl"
              >
                ✕
              </button>

            </div>


            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name
                  </label>

                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Electronic Components"
                    className="w-full border border-slate-200 rounded-lg px-4 py-3"
                  />
                </div>


                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>

                  <select
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3"
                  >

                    <option value="">
                      Select Category
                    </option>

                    <option>Electronics</option>
                    <option>Textiles</option>
                    <option>Machinery</option>
                    <option>Food</option>
                    <option>Automotive</option>
                    <option>Other</option>

                  </select>
                </div>


                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantity
                  </label>

                  <input
                    required
                    type="number"
                    min="1"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 100"
                    className="w-full border border-slate-200 rounded-lg px-4 py-3"
                  />
                </div>


                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Weight (kg)
                  </label>

                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="e.g. 350"
                    className="w-full border border-slate-200 rounded-lg px-4 py-3"
                  />
                </div>


                {/* Dimensions */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dimensions
                  </label>

                  <input
                    required
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    placeholder="e.g. 40 × 30 × 25 cm"
                    className="w-full border border-slate-200 rounded-lg px-4 py-3"
                  />
                </div>


                {/* Package Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Package Type
                  </label>

                  <select
                    required
                    name="packageType"
                    value={formData.packageType}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3"
                  >

                    <option value="">
                      Select Package Type
                    </option>

                    <option>Box</option>
                    <option>Crate</option>
                    <option>Bale</option>
                    <option>Pallet</option>
                    <option>Container</option>

                  </select>
                </div>


                {/* Number of Packages */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of Packages
                  </label>

                  <input
                    required
                    type="number"
                    min="1"
                    name="packages"
                    value={formData.packages}
                    onChange={handleChange}
                    placeholder="e.g. 12"
                    className="w-full border border-slate-200 rounded-lg px-4 py-3"
                  />
                </div>


                {/* Declared Value */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Declared Value
                  </label>

                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    placeholder="e.g. 18500"
                    className="w-full border border-slate-200 rounded-lg px-4 py-3"
                  />
                </div>


                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Currency
                  </label>

                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3"
                  >

                    <option>USD</option>
                    <option>INR</option>
                    <option>EUR</option>
                    <option>GBP</option>
                    <option>AED</option>
                    <option>SGD</option>

                  </select>
                </div>

              </div>


              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-8">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Save Cargo
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