import { useState } from 'react'

function CostEstimator() {
  const [form, setForm] = useState({
    cargo: '',
    weight: '',
    dimensions: '',
    packageType: 'Carton',
    packages: '',
    origin: '',
    destination: '',
    method: 'Air',
    currency: 'USD',
  })

  const [estimate, setEstimate] = useState(null)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const calculateEstimate = () => {
    if (
      !form.cargo ||
      !form.weight ||
      !form.packages ||
      !form.origin ||
      !form.destination
    ) {
      alert('Please fill in all required fields.')
      return
    }

    const weight = Number(form.weight)
    const packages = Number(form.packages)

    let rate = 8
    let delivery = '3–5 days'

    if (form.method === 'Sea') {
      rate = 3
      delivery = '15–25 days'
    }

    if (form.method === 'Road') {
      rate = 5
      delivery = '7–12 days'
    }

    const baseCost = weight * rate
    const packageCharge = packages * 15
    const totalCost = baseCost + packageCharge

    setEstimate({
      baseCost,
      packageCharge,
      totalCost,
      delivery,
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Shipping Cost Estimator
        </h1>

        <p className="mt-2 text-slate-500">
          Estimate shipping cost based on your cargo and transport details.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Form */}
        <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">

          <h2 className="mb-6 text-xl font-semibold text-slate-800">
            Shipment Details
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Cargo */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Cargo
              </label>

              <input
                type="text"
                name="cargo"
                value={form.cargo}
                onChange={handleChange}
                placeholder="e.g. Electronic Components"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Weight (kg)
              </label>

              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="e.g. 350"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Dimensions */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Dimensions
              </label>

              <input
                type="text"
                name="dimensions"
                value={form.dimensions}
                onChange={handleChange}
                placeholder="e.g. 120 × 80 × 60 cm"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Package Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Package Type
              </label>

              <select
                name="packageType"
                value={form.packageType}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option>Carton</option>
                <option>Box</option>
                <option>Pallet</option>
                <option>Crate</option>
                <option>Container</option>
              </select>
            </div>

            {/* Number of Packages */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Number of Packages
              </label>

              <input
                type="number"
                name="packages"
                value={form.packages}
                onChange={handleChange}
                placeholder="e.g. 12"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Currency */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Currency
              </label>

              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>INR</option>
              </select>
            </div>

            {/* Origin */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Origin / Pickup Location
              </label>

              <input
                type="text"
                name="origin"
                value={form.origin}
                onChange={handleChange}
                placeholder="e.g. Mumbai, India"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Destination */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Destination
              </label>

              <input
                type="text"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                placeholder="e.g. Dubai, UAE"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Transport Method */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Transport Method
              </label>

              <div className="grid grid-cols-3 gap-3">

                {['Air', 'Sea', 'Road'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        method,
                      })
                    }
                    className={`rounded-lg border px-4 py-3 font-medium transition ${
                      form.method === method
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {method}
                  </button>
                ))}

              </div>
            </div>

          </div>

          <button
            onClick={calculateEstimate}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Calculate Estimate
          </button>

        </div>

        {/* Result */}
        <div className="rounded-xl bg-slate-900 p-6 text-white shadow-sm">

          <h2 className="mb-6 text-xl font-semibold">
            Estimated Cost
          </h2>

          {estimate ? (
            <div className="space-y-5">

              <div>
                <p className="text-sm text-slate-400">
                  Total Estimated Cost
                </p>

                <p className="mt-2 text-4xl font-bold">
                  {form.currency} {estimate.totalCost.toLocaleString()}
                </p>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Base Shipping
                  </span>

                  <span>
                    {form.currency} {estimate.baseCost.toLocaleString()}
                  </span>
                </div>

                <div className="mt-3 flex justify-between">
                  <span className="text-slate-400">
                    Package Charges
                  </span>

                  <span>
                    {form.currency} {estimate.packageCharge.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <p className="text-sm text-slate-400">
                  Estimated Delivery
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {estimate.delivery}
                </p>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <p className="text-sm text-slate-400">
                  Transport Method
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {form.method}
                </p>
              </div>

            </div>
          ) : (
            <div className="flex min-h-72 items-center justify-center text-center text-slate-400">
              <p>
                Enter shipment details and calculate an
                estimated shipping cost.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default CostEstimator