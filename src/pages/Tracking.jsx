import { useEffect, useState } from 'react'

function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shipment, setShipment] = useState(null)
  const [trackingRecords, setTrackingRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTracking()
  }, [])

  const fetchTracking = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:5000/api/tracking',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch tracking'
        )
      }

      setTrackingRecords(data)

    } catch (error) {
      console.error(error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return 'Not available'

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    )
  }

  const formatDateTime = (date) => {
    if (!date) return 'Not available'

    return new Date(date).toLocaleString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    )
  }

  const handleTrack = () => {
    const tracking = trackingNumber
      .trim()
      .toUpperCase()

    if (!tracking) {
      alert('Please enter a tracking number.')
      return
    }

    const foundShipment = trackingRecords.find(
      (item) =>
        item.tracking_number.toUpperCase() === tracking
    )

    if (!foundShipment) {
      setShipment(null)

      alert(
        'Shipment not found. Please enter a valid tracking number.'
      )

      return
    }

    setShipment(foundShipment)
  }

  const getProgress = (status) => {
    const statuses = [
      'Pending',
      'Picked Up',
      'In Transit',
      'Arrived at Destination',
      'Delivered',
    ]

    const currentIndex = statuses.indexOf(status)

    return statuses.map((item, index) => ({
      title: item,
      completed:
        currentIndex >= index,
    }))
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
            onChange={(e) =>
              setTrackingNumber(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleTrack()
              }
            }}
            placeholder="Enter tracking number e.g. TRK-1791012945100"
            className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            onClick={handleTrack}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Track Shipment
          </button>

        </div>

        <p className="mt-3 text-sm text-slate-400">
          Enter the tracking number generated for your shipment.
        </p>

      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-6 rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm">
          Loading tracking information...
        </div>
      )}

      {/* Shipment Result */}
      {!loading && shipment && (
        <div className="mt-6 space-y-6">

          {/* Shipment Summary */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div>
                <p className="text-sm text-slate-500">
                  Tracking Number
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {shipment.tracking_number}
                </h2>
              </div>

              <span className="w-fit rounded-full bg-blue-100 px-4 py-2 font-medium text-blue-700">
                {shipment.status}
              </span>

            </div>

            <div className="mt-6 grid gap-5 border-t pt-6 md:grid-cols-4">

              <div>
                <p className="text-sm text-slate-500">
                  Shipment
                </p>

                <p className="mt-1 font-semibold">
                  {shipment.shipment_number}
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
                  {shipment.shipping_method}
                </p>
              </div>

            </div>

          </div>

          {/* Location / Provider / Delivery */}
          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-xl bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Current Location
              </p>

              <p className="mt-2 text-xl font-bold">
                {shipment.current_location || 'Not available'}
              </p>

            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Logistics Provider
              </p>

              <p className="mt-2 text-xl font-bold">
                {shipment.provider_name || 'Not Assigned'}
              </p>

            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Estimated Delivery
              </p>

              <p className="mt-2 text-xl font-bold">
                {formatDate(
                  shipment.estimated_delivery
                )}
              </p>

            </div>

          </div>

          {/* Last Updated */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Last Updated
            </p>

            <p className="mt-2 font-semibold">
              {formatDateTime(
                shipment.last_updated
              )}
            </p>

          </div>

          {/* Timeline */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="mb-8 text-xl font-semibold">
              Shipment Progress
            </h2>

            <div className="relative ml-3">

              <div className="absolute left-2 top-2 h-[calc(100%-16px)] w-0.5 bg-slate-200" />

              <div className="space-y-8">

                {getProgress(
                  shipment.status
                ).map((event, index) => (

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
