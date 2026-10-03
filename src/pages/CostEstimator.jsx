import { useState } from 'react'

function CostEstimator() {
  const [formData, setFormData] = useState({
    weight: '',
    shipping_method: '',
    origin: '',
    destination: '',
  })

  const [estimate, setEstimate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

    setEstimate(null)
    setError('')
  }

  const calculateCost = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')
      setEstimate(null)

      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:5000/api/cost-estimate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to calculate cost'
        )
      }

      setEstimate(data.estimate)

    } catch (error) {
      console.error(error)

      setError(
        error.message || 'Unable to calculate shipping cost'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-800">
          Shipping Cost Estimator
        </h1>

        <p className="text-slate-500 mt-1">
          Estimate your cargo shipping cost based on weight and transport method
        </p>

      </div>


      {/* ERROR */}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


        {/* FORM */}

        <div className="bg-white border border-slate-200 rounded-xl p-6">

          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Shipment Details
          </h2>

          <form
            onSubmit={calculateCost}
            className="space-y-5"
          >

            {/* WEIGHT */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cargo Weight (kg)
              </label>

              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                placeholder="Enter weight"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* SHIPPING METHOD */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Shipping Method
              </label>

              <select
                name="shipping_method"
                value={formData.shipping_method}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="">
                  Select shipping method
                </option>

                <option value="Air">
                  Air
                </option>

                <option value="Sea">
                  Sea
                </option>

                <option value="Road">
                  Road
                </option>

              </select>

            </div>


            {/* ORIGIN */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Origin
              </label>

              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="Mumbai, India"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* DESTINATION */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Destination
              </label>

              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Dubai, UAE"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-lg font-medium transition"
            >
              {loading
                ? 'Calculating...'
                : 'Calculate Shipping Cost'}
            </button>

          </form>

        </div>


        {/* RESULT */}

        <div className="bg-white border border-slate-200 rounded-xl p-6">

          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Cost Estimate
          </h2>

          {!estimate ? (

            <div className="h-64 flex items-center justify-center text-center">

              <div>

                <div className="text-5xl mb-4">
                  💰
                </div>

                <p className="text-slate-500">
                  Enter shipment details and calculate the estimated cost.
                </p>

              </div>

            </div>

          ) : (

            <div className="space-y-5">

              {/* TOTAL */}

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">

                <p className="text-sm text-blue-600 font-medium">
                  Estimated Shipping Cost
                </p>

                <p className="text-4xl font-bold text-blue-700 mt-2">
                  {estimate.currency} {Number(
                    estimate.estimated_cost
                  ).toLocaleString()}
                </p>

              </div>


              {/* DETAILS */}

              <div className="space-y-4">

                <div className="flex justify-between border-b border-slate-100 pb-3">

                  <span className="text-slate-500">
                    Weight
                  </span>

                  <span className="font-medium text-slate-800">
                    {estimate.weight} kg
                  </span>

                </div>


                <div className="flex justify-between border-b border-slate-100 pb-3">

                  <span className="text-slate-500">
                    Shipping Method
                  </span>

                  <span className="font-medium text-slate-800">
                    {estimate.shipping_method}
                  </span>

                </div>


                <div className="flex justify-between border-b border-slate-100 pb-3">

                  <span className="text-slate-500">
                    Rate per kg
                  </span>

                  <span className="font-medium text-slate-800">
                    {estimate.currency} {estimate.rate_per_kg}
                  </span>

                </div>


                <div className="flex justify-between border-b border-slate-100 pb-3">

                  <span className="text-slate-500">
                    Base Cost
                  </span>

                  <span className="font-medium text-slate-800">
                    {estimate.currency} {Number(
                      estimate.base_cost
                    ).toLocaleString()}
                  </span>

                </div>


                <div className="flex justify-between border-b border-slate-100 pb-3">

                  <span className="text-slate-500">
                    Location Charge
                  </span>

                  <span className="font-medium text-slate-800">
                    {estimate.currency} {Number(
                      estimate.location_charge
                    ).toLocaleString()}
                  </span>

                </div>

              </div>


              {/* ROUTE */}

              <div className="bg-slate-50 rounded-lg p-4">

                <p className="text-sm text-slate-500 mb-2">
                  Shipping Route
                </p>

                <p className="font-medium text-slate-800">
                  {estimate.origin}
                </p>

                <p className="text-slate-400 my-1">
                  ↓
                </p>

                <p className="font-medium text-slate-800">
                  {estimate.destination}
                </p>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  )
}

export default CostEstimator