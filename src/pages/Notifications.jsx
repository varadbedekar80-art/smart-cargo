import { useEffect, useState } from 'react'

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem('token')

      const headers = {
        Authorization: `Bearer ${token}`,
      }

      const [shipmentsResponse, paymentsResponse, documentsResponse] =
        await Promise.all([
          fetch('http://localhost:5000/api/shipments', {
            headers,
          }),

          fetch('http://localhost:5000/api/payments', {
            headers,
          }),

          fetch('http://localhost:5000/api/documents', {
            headers,
          }),
        ])

      const shipments = await shipmentsResponse.json()
      const payments = await paymentsResponse.json()
      const documents = await documentsResponse.json()

      if (!shipmentsResponse.ok) {
        throw new Error(
          shipments.message || 'Failed to fetch shipments'
        )
      }

      if (!paymentsResponse.ok) {
        throw new Error(
          payments.message || 'Failed to fetch payments'
        )
      }

      if (!documentsResponse.ok) {
        throw new Error(
          documents.message || 'Failed to fetch documents'
        )
      }

      const generatedNotifications = []

      // Shipment notifications
      shipments.forEach((shipment) => {
        generatedNotifications.push({
          id: `shipment-${shipment.id}`,
          title: 'Shipment Status Updated',
          message: `Shipment ${
            shipment.shipment_number
          } is currently ${shipment.status}.`,
          type: 'Shipment',
          createdAt: shipment.created_at,
          read: false,
        })
      })

      // Payment notifications
      payments.forEach((payment) => {
        generatedNotifications.push({
          id: `payment-${payment.id}`,
          title:
            payment.status === 'Completed'
              ? 'Payment Confirmed'
              : 'Payment Status Updated',
          message: `Payment ${
            payment.payment_reference
          } of ${
            payment.currency || 'USD'
          } ${Number(payment.amount).toLocaleString()} is ${
            payment.status
          }.`,
          type: 'Payment',
          createdAt: payment.payment_date,
          read: false,
        })
      })

      // Document notifications
      documents.forEach((document) => {
        generatedNotifications.push({
          id: `document-${document.id}`,
          title: 'Document Status Updated',
          message: `${
            document.document_name
          } is currently ${
            document.status
          }.`,
          type: 'Document',
          createdAt: document.uploaded_at,
          read: false,
        })
      })

      // Sort newest first
      generatedNotifications.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0)
        const dateB = new Date(b.createdAt || 0)

        return dateB - dateA
      })

      setNotifications(generatedNotifications)
    } catch (error) {
      console.error(error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    )
  }

  const deleteNotification = (id) => {
    setNotifications(
      notifications.filter(
        (notification) =>
          notification.id !== id
      )
    )
  }

  const getTypeStyle = (type) => {
    if (type === 'Payment') {
      return 'bg-green-100 text-green-700'
    }

    if (type === 'Document') {
      return 'bg-purple-100 text-purple-700'
    }

    return 'bg-blue-100 text-blue-700'
  }

  const getTypeIcon = (type) => {
    if (type === 'Payment') {
      return '$'
    }

    if (type === 'Document') {
      return 'D'
    }

    return 'S'
  }

  const formatTime = (date) => {
    if (!date) {
      return 'Recently'
    }

    const notificationDate = new Date(date)
    const now = new Date()

    const difference =
      now.getTime() -
      notificationDate.getTime()

    const minutes = Math.floor(
      difference / (1000 * 60)
    )

    if (minutes < 1) {
      return 'Just now'
    }

    if (minutes < 60) {
      return `${minutes} minute${
        minutes === 1 ? '' : 's'
      } ago`
    }

    const hours = Math.floor(
      minutes / 60
    )

    if (hours < 24) {
      return `${hours} hour${
        hours === 1 ? '' : 's'
      } ago`
    }

    const days = Math.floor(
      hours / 24
    )

    if (days === 1) {
      return 'Yesterday'
    }

    if (days < 7) {
      return `${days} days ago`
    }

    return notificationDate.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    )
  }

  const unreadCount = notifications.filter(
    (notification) =>
      !notification.read
  ).length

  const readCount = notifications.filter(
    (notification) =>
      notification.read
  ).length

  return (
    <div>

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Notifications
          </h1>

          <p className="mt-2 text-slate-500">
            Stay updated with your shipments, payments, and documents.
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          disabled={notifications.length === 0}
          className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Mark All as Read
        </button>

      </div>

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <p className="text-slate-500">
            Loading notifications...
          </p>
        </div>
      ) : (
        <>

          {/* Summary */}
          <div className="mb-6 grid gap-5 md:grid-cols-3">

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Notifications
              </p>

              <p className="mt-2 text-3xl font-bold">
                {notifications.length}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Unread
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {unreadCount}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Read
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {readCount}
              </p>
            </div>

          </div>

          {/* Notification List */}
          <div className="space-y-4">

            {notifications.length === 0 ? (
              <div className="rounded-xl bg-white p-10 text-center shadow-sm">

                <p className="text-lg font-medium text-slate-700">
                  No notifications
                </p>

                <p className="mt-2 text-slate-500">
                  You're all caught up.
                </p>

              </div>
            ) : (
              notifications.map(
                (notification) => (

                  <div
                    key={notification.id}
                    className={`rounded-xl border bg-white p-5 shadow-sm transition ${
                      notification.read
                        ? 'border-slate-200'
                        : 'border-blue-200 bg-blue-50/40'
                    }`}
                  >

                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                      <div className="flex gap-4">

                        {/* Icon */}
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${getTypeStyle(
                            notification.type
                          )}`}
                        >
                          {getTypeIcon(
                            notification.type
                          )}
                        </div>

                        {/* Content */}
                        <div>

                          <div className="flex flex-wrap items-center gap-2">

                            <h2 className="font-semibold text-slate-800">
                              {notification.title}
                            </h2>

                            {!notification.read && (
                              <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                                New
                              </span>
                            )}

                          </div>

                          <p className="mt-1 text-slate-600">
                            {notification.message}
                          </p>

                          <div className="mt-2 flex gap-3 text-sm text-slate-400">

                            <span>
                              {notification.type}
                            </span>

                            <span>•</span>

                            <span>
                              {formatTime(
                                notification.createdAt
                              )}
                            </span>

                          </div>

                        </div>

                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">

                        {!notification.read && (
                          <button
                            onClick={() =>
                              markAsRead(
                                notification.id
                              )
                            }
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
                          >
                            Mark Read
                          </button>
                        )}

                        <button
                          onClick={() =>
                            deleteNotification(
                              notification.id
                            )
                          }
                          className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )
            )}

          </div>

        </>
      )}

    </div>
  )
}

export default Notifications