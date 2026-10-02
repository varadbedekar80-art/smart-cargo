import { useState } from 'react'

function Providers() {
  const [selectedProvider, setSelectedProvider] = useState(null)

  const providers = [
    {
      id: 1,
      name: 'Global Express',
      type: 'International Logistics',
      services: 'Air, Sea, Road',
      delivery: '3–7 days',
      rating: '4.8',
      price: '$2,450',
    },
    {
      id: 2,
      name: 'Ocean Logistics',
      type: 'Freight Forwarding',
      services: 'Sea, Road',
      delivery: '15–25 days',
      rating: '4.6',
      price: '$1,850',
    },
    {
      id: 3,
      name: 'Swift Cargo',
      type: 'Cargo & Freight',
      services: 'Air, Road',
      delivery: '5–10 days',
      rating: '4.5',
      price: '$2,150',
    },
  ]

  return (
    <div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Logistics Providers
        </h1>

        <p className="mt-2 text-slate-500">
          Select a logistics provider for your shipment.
        </p>
      </div>

      {/* Shipment Info */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">

          <div>
            <p className="text-sm text-slate-500">
              Shipment
            </p>
            <p className="mt-1 font-semibold">
              SC-10024
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Origin
            </p>
            <p className="mt-1 font-semibold">
              Mumbai, India
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Destination
            </p>
            <p className="mt-1 font-semibold">
              Dubai, UAE
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Transport
            </p>
            <p className="mt-1 font-semibold">
              Air
            </p>
          </div>

        </div>
      </div>

      {/* Provider Cards */}
      <div className="grid gap-6 lg:grid-cols-3">

        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`rounded-xl bg-white p-6 shadow-sm transition ${
              selectedProvider?.id === provider.id
                ? 'ring-2 ring-blue-600'
                : ''
            }`}
          >

            <div className="mb-5 flex items-start justify-between">

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {provider.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {provider.type}
                </p>
              </div>

              <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                ★ {provider.rating}
              </span>

            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4">

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Services
                </span>

                <span className="font-medium">
                  {provider.services}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Delivery
                </span>

                <span className="font-medium">
                  {provider.delivery}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Estimated Cost
                </span>

                <span className="text-lg font-bold text-slate-800">
                  {provider.price}
                </span>
              </div>

            </div>

            <button
              onClick={() => setSelectedProvider(provider)}
              className={`mt-6 w-full rounded-lg px-4 py-3 font-medium transition ${
                selectedProvider?.id === provider.id
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {selectedProvider?.id === provider.id
                ? 'Selected'
                : 'Select Provider'}
            </button>

          </div>
        ))}

      </div>

      {/* Selection Confirmation */}
      {selectedProvider && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5">

          <p className="text-green-800">
            <span className="font-semibold">
              Provider Selected:
            </span>{' '}
            {selectedProvider.name}
          </p>

          <p className="mt-1 text-sm text-green-700">
            This provider is selected for shipment SC-10024.
          </p>

        </div>
      )}

    </div>
  )
}

export default Providers