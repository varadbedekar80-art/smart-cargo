import { useEffect, useState } from 'react'

function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  const fetchPayments = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        'https://smart-cargo.onrender.com/api/admin/payments',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load payments')
      }

      setPayments(data)
    } catch (error) {
      console.error('ADMIN PAYMENTS ERROR:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const updateStatus = async (paymentId, status) => {
    try {
      const response = await fetch(
        `https://smart-cargo.onrender.com/api/admin/payments/${paymentId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update payment status')
      }

      setPayments((currentPayments) =>
        currentPayments.map((payment) =>
          payment.id === paymentId
            ? { ...payment, status }
            : payment
        )
      )
    } catch (error) {
      console.error('UPDATE PAYMENT STATUS ERROR:', error)
      alert(error.message)
    }
  }

  const completedCount = payments.filter(
    (payment) => payment.status === 'Completed'
  ).length

  const pendingCount = payments.filter(
    (payment) => payment.status === 'Pending'
  ).length

  const failedCount = payments.filter(
    (payment) => payment.status === 'Failed'
  ).length

  const totalCompletedAmount = payments
    .filter((payment) => payment.status === 'Completed')
    .reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0
    )

  const getStatusStyle = (status) => {
    if (status === 'Completed') {
      return 'bg-green-100 text-green-700'
    }

    if (status === 'Failed') {
      return 'bg-red-100 text-red-700'
    }

    if (status === 'Refunded') {
      return 'bg-purple-100 text-purple-700'
    }

    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Payment Management
        </h1>

        <p className="mt-2 text-gray-500">
          Monitor and manage payments across the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500">
            Total Payments
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {payments.length}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500">
            Completed
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {completedCount}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500">
            Pending
          </p>

          <h2 className="mt-2 text-3xl font-bold text-yellow-600">
            {pendingCount}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500">
            Completed Amount
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            ${totalCompletedAmount.toFixed(2)}
          </h2>

          <p className="text-xs text-gray-400 mt-1">
            Failed: {failedCount}
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            All Payments
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            View and manage payments made by business users.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading payments...
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 font-medium">
              {error}
            </p>

            <button
              onClick={fetchPayments}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No payments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Payment Reference
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Business / Owner
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Shipment
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Method
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">
                        {payment.payment_reference}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {payment.business_name ||
                          'No business profile'}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Owner: {payment.owner_name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {payment.owner_email}
                      </p>
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-700">
                      {payment.shipment_number ||
                        'Not Assigned'}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">
                        {payment.currency || 'USD'}{' '}
                        {Number(payment.amount || 0).toFixed(2)}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {payment.payment_method}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {payment.payment_date
                        ? new Date(
                            payment.payment_date
                          ).toLocaleDateString()
                        : 'Not Available'}
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={payment.status}
                        onChange={(event) =>
                          updateStatus(
                            payment.id,
                            event.target.value
                          )
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Completed">
                          Completed
                        </option>

                        <option value="Failed">
                          Failed
                        </option>

                        <option value="Refunded">
                          Refunded
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Payments