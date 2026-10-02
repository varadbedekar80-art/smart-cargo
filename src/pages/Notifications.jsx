import { useState } from 'react'

function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Shipment Status Updated',
      message: 'Shipment SC-10024 is now in transit.',
      type: 'Shipment',
      time: '10 minutes ago',
      read: false,
    },
    {
      id: 2,
      title: 'Payment Confirmed',
      message: 'Payment of $2,450 for shipment SC-10024 was successful.',
      type: 'Payment',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 3,
      title: 'Document Approved',
      message: 'Commercial Invoice for SC-10024 has been approved.',
      type: 'Document',
      time: 'Yesterday',
      read: true,
    },
    {
      id: 4,
      title: 'Shipment Created',
      message: 'Shipment SC-10023 has been successfully created.',
      type: 'Shipment',
      time: 'Yesterday',
      read: true,
    },
  ])

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
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
        (notification) => notification.id !== id
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
          className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium hover:bg-slate-50"
        >
          Mark All as Read
        </button>

      </div>

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
            {notifications.filter(
              (notification) => !notification.read
            ).length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Read
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {notifications.filter(
              (notification) => notification.read
            ).length}
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
          notifications.map((notification) => (

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

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${getTypeStyle(
                      notification.type
                    )}`}
                  >
                    {notification.type === 'Payment'
                      ? '$'
                      : notification.type === 'Document'
                        ? 'D'
                        : 'S'}
                  </div>

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
                      <span>{notification.type}</span>
                      <span>•</span>
                      <span>{notification.time}</span>
                    </div>

                  </div>

                </div>

                <div className="flex gap-2">

                  {!notification.read && (
                    <button
                      onClick={() =>
                        markAsRead(notification.id)
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
                    >
                      Mark Read
                    </button>
                  )}

                  <button
                    onClick={() =>
                      deleteNotification(notification.id)
                    }
                    className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))
        )}

      </div>

    </div>
  )
}

export default Notifications