import { useState } from 'react'

function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shipment, setShipment] = useState(null)

  const shipments = {
    'SC-10024': {
      tracking: 'SC-10024',
      cargo: 'Electronic Components',
      origin: 'Mumbai, India',
      destination: 'Dubai, UAE',
      method: 'Air',
      provider: 'Global Express',
      currentStatus: 'In Transit',
      estimatedDelivery: '05 Oct 2026',
      timeline: [
        {
          title: 'Shipment Created',
          date: '28 Sep 2026',
          completed: true,
        },
        {
          title: 'Pickup Completed',
          date: '29 Sep 2026',
          completed: true,
        },
        {
          title: 'In Transit',
          date: '30 Sep 2026',
          completed: true,
        },
        {
          title: 'Arrived at Destination',
          date: '04 Oct 2026',
          completed: false,
        },
        {
          title: 'Delivered',
          date: '05 Oct 2026',
          completed: false,
        },
      ],
    },

    'SC-10023': {
      tracking: 'SC-10023',
      cargo: 'Cotton Textiles',
      origin: 'Pune, India',
      destination: 'Singapore',
      method: 'Sea',
      provider: 'Ocean Logistics',
      currentStatus: 'Pending',
      estimatedDelivery: '20 Oct 2026',
      timeline: [
        {
          title: 'Shipment Created',
          date: '27 Sep 2026',
          completed: true,
        },
        {
          title: 'Pickup Completed',
          date: '30 Sep 2026',
          completed: false,
        },
        {
          title: 'In Transit',
          date: '05 Oct 2026',
          completed: false,
        },
        {
          title: 'Arrived at Destination',
          date: '18 Oct 2026',
          completed: false,
        },
        {
          title: 'Delivered',
          date: '20 Oct 2026',
          completed: false,
        },
      ],
    },
  }

  const handleTrack = () => {
    const tracking = trackingNumber.trim().toUpperCase()

    if (!tracking) {
      alert('Please enter a tracking number.')
      return
    }

    if (!shipments[tracking]) {
      alert('Shipment not found. Try SC-10024 or SC-10023.')
      setShipment(null)
      return
    }

    setShipment(shipments[tracking])
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Shipment Tracking
        </h1>

        <p className="mt-2 text-slate-500">
          Track your shipment using its tracking number.
        </p>
      </div>

      {/* Search */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          Track Shipment
        </h2>

        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleTrack()
              }
            }}
            placeholder="Enter tracking number e.g. SC-10024"
            className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            onClick={handleTrack}
            className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700"
          >
            Track Shipment
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-400">
          Demo tracking numbers: SC-10024, SC-10023
        </p>
      </div>

      {/* Shipment Result */}
      {shipment && (
        <div className="mt-6 space-y-6">

          {/* Shipment Summary */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div>
                <p className="text-sm text-slate-500">
                  Tracking Number
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {shipment.tracking}
                </h2>
              </div>

              <span className="w-fit rounded-full bg-blue-100 px-4 py-2 font-medium text-blue-700">
                {shipment.currentStatus}
              </span>

            </div>

            <div className="mt-6 grid gap-5 border-t pt-6 md:grid-cols-4">

              <div>
                <p className="text-sm text-slate-500">
                  Cargo
                </p>

                <p className="mt-1 font-semibold">
                  {shipment.cargo}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Origin
                </p>

                <p className="mt-1 font-semibold">
                  {shipment.origin}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Destination
                </p>

                <p className="mt-1 font-semibold">
                  {shipment.destination}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Transport
                </p>

                <p className="mt-1 font-semibold">
                  {shipment.method}
                </p>
              </div>

            </div>

          </div>

          {/* Provider and Delivery */}
          <div className="grid gap-6 md:grid-cols-2">

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Logistics Provider
              </p>

              <p className="mt-2 text-xl font-bold">
                {shipment.provider}
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Estimated Delivery
              </p>

              <p className="mt-2 text-xl font-bold">
                {shipment.estimatedDelivery}
              </p>
            </div>

          </div>

          {/* Timeline */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="mb-8 text-xl font-semibold">
              Shipment Progress
            </h2>

            <div className="relative ml-3">

              <div className="absolute left-2 top-2 h-[calc(100%-16px)] w-0.5 bg-slate-200" />

              <div className="space-y-8">

                {shipment.timeline.map((event, index) => (

                  <div
                    key={index}
                    className="relative flex gap-5"
                  >

                    <div
                      className={`relative z-10 h-5 w-5 shrink-0 rounded-full border-4 border-white ${
                        event.completed
                          ? 'bg-green-500'
                          : 'bg-slate-300'
                      }`}
                    />

                    <div>
                      <p
                        className={`font-semibold ${
                          event.completed
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {event.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {event.date}
                      </p>
                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  )
}

export default Tracking