import { useEffect, useState } from 'react'

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [shipments, setShipments] = useState([])
  const [payments, setPayments] = useState([])
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const [usersRes, shipmentsRes, paymentsRes, documentsRes] =
          await Promise.all([
            fetch('https://smart-cargo.onrender.com/api/users', { headers }),
            fetch('https://smart-cargo.onrender.com/api/shipments', { headers }),
            fetch('https://smart-cargo.onrender.com/api/payments', { headers }),
            fetch('https://smart-cargo.onrender.com/api/documents', { headers }),
          ])

        const usersData = await usersRes.json()
        const shipmentsData = await shipmentsRes.json()
        const paymentsData = await paymentsRes.json()
        const documentsData = await documentsRes.json()

        setUsers(Array.isArray(usersData) ? usersData : [])
        setShipments(Array.isArray(shipmentsData) ? shipmentsData : [])
        setPayments(Array.isArray(paymentsData) ? paymentsData : [])
        setDocuments(Array.isArray(documentsData) ? documentsData : [])
      } catch (error) {
        console.error('ADMIN DASHBOARD ERROR:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [token])

  const totalUsers = users.length

  const totalBusinesses = users.filter(
    user => user.role === 'Business User'
  ).length

  const totalShipments = shipments.length

  const pendingPayments = payments.filter(
    payment => payment.status === 'Pending'
  ).length

  const pendingShipments = shipments.filter(
    shipment => shipment.status === 'Pending'
  ).length

  const inTransitShipments = shipments.filter(
    shipment =>
      shipment.status === 'In Transit' ||
      shipment.status === 'Shipped'
  ).length

  const completedShipments = shipments.filter(
    shipment =>
      shipment.status === 'Completed' ||
      shipment.status === 'Delivered'
  ).length

  const cancelledShipments = shipments.filter(
    shipment => shipment.status === 'Cancelled'
  ).length

  const pendingDocuments = documents.filter(
    document => document.status === 'Pending'
  ).length

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-500">
          Loading administrator dashboard...
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Administrator Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor users, businesses, shipments, documents, and payments.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Users
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {totalUsers}
          </p>

          <p className="mt-2 text-sm text-blue-600">
            Registered users
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Businesses
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {totalBusinesses}
          </p>

          <p className="mt-2 text-sm text-green-600">
            Business users
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Shipments
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {totalShipments}
          </p>

          <p className="mt-2 text-sm text-orange-600">
            {inTransitShipments} In Transit
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Pending Payments
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {pendingPayments}
          </p>

          <p className="mt-2 text-sm text-red-600">
            Requires attention
          </p>
        </div>

      </div>

      {/* Main Sections */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        {/* Shipment Overview */}
        <div className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-800">
            Shipment Overview
          </h2>

          <div className="mt-6 space-y-5">

            <div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">
                  Pending
                </span>

                <span className="font-medium">
                  {pendingShipments}
                </span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-yellow-400"
                  style={{
                    width: totalShipments
                      ? `${(pendingShipments / totalShipments) * 100}%`
                      : '0%',
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">
                  In Transit
                </span>

                <span className="font-medium">
                  {inTransitShipments}
                </span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{
                    width: totalShipments
                      ? `${(inTransitShipments / totalShipments) * 100}%`
                      : '0%',
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">
                  Completed
                </span>

                <span className="font-medium">
                  {completedShipments}
                </span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{
                    width: totalShipments
                      ? `${(completedShipments / totalShipments) * 100}%`
                      : '0%',
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">
                  Cancelled
                </span>

                <span className="font-medium">
                  {cancelledShipments}
                </span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-red-400"
                  style={{
                    width: totalShipments
                      ? `${(cancelledShipments / totalShipments) * 100}%`
                      : '0%',
                  }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* System Summary */}
        <div className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-800">
            System Summary
          </h2>

          <div className="mt-5 space-y-4">

            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-slate-600">
                Total Users
              </span>

              <span className="font-semibold text-slate-800">
                {totalUsers}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-slate-600">
                Business Users
              </span>

              <span className="font-semibold text-slate-800">
                {totalBusinesses}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-slate-600">
                Total Documents
              </span>

              <span className="font-semibold text-slate-800">
                {documents.length}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-slate-600">
                Pending Documents
              </span>

              <span className="font-semibold text-orange-600">
                {pendingDocuments}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">
                Total Payments
              </span>

              <span className="font-semibold text-slate-800">
                {payments.length}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

        <h2 className="text-xl font-semibold text-slate-800">
          Quick Actions
        </h2>

        <div className="mt-5 flex flex-wrap gap-3">

          <button className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700">
            Manage Users
          </button>

          <button className="rounded-lg bg-slate-100 px-5 py-3 font-medium text-slate-700 hover:bg-slate-200">
            Review Documents
          </button>

          <button className="rounded-lg bg-slate-100 px-5 py-3 font-medium text-slate-700 hover:bg-slate-200">
            View Shipments
          </button>

          <button className="rounded-lg bg-slate-100 px-5 py-3 font-medium text-slate-700 hover:bg-slate-200">
            Manage Providers
          </button>

        </div>

      </div>
    </div>
  )
}

export default AdminDashboard