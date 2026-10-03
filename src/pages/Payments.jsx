import { useEffect, useState } from 'react'

function Payments() {
  const [payments, setPayments] = useState([])
  const [shipments, setShipments] = useState([])

  const [showModal, setShowModal] = useState(false)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    shipment_id: '',
    amount: '',
    currency: 'USD',
    payment_method: 'Online',
  })


  // ==============================
  // FETCH PAYMENTS
  // ==============================

  const fetchPayments = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        'https://smart-cargo.onrender.com/api/payments',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch payments'
        )
      }

      setPayments(data)

    } catch (error) {
      console.error(error)

      setError(
        error.message || 'Unable to load payments'
      )
    } finally {
      setLoading(false)
    }
  }


  // ==============================
  // FETCH SHIPMENTS
  // ==============================

  const fetchShipments = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        'https://smart-cargo.onrender.com/api/shipments',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch shipments'
        )
      }

      setShipments(data)

    } catch (error) {
      console.error(error)
    }
  }


  // ==============================
  // LOAD DATA
  // ==============================

  useEffect(() => {
    fetchPayments()
    fetchShipments()
  }, [])


  // ==============================
  // FORM CHANGE
  // ==============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }


  // ==============================
  // CREATE PAYMENT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        'https://smart-cargo.onrender.com/api/payments',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            shipment_id: formData.shipment_id
              ? Number(formData.shipment_id)
              : null,

            amount: Number(formData.amount),

            currency: formData.currency,

            payment_method: formData.payment_method,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to create payment'
        )
      }

      await fetchPayments()

      setFormData({
        shipment_id: '',
        amount: '',
        currency: 'USD',
        payment_method: 'Online',
      })

      setShowModal(false)

    } catch (error) {
      console.error(error)

      setError(
        error.message || 'Unable to create payment'
      )
    } finally {
      setSaving(false)
    }
  }


  // ==============================
  // STATUS STYLE
  // ==============================

  const getStatusClass = (status) => {
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


  // ==============================
  // TOTAL COMPLETED PAYMENTS
  // ==============================

  const completedAmount = payments
    .filter(
      (payment) =>
        payment.status === 'Completed'
    )
    .reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    )


  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Payments
          </h1>

          <p className="text-slate-500 mt-1">
            Manage shipment payments and transactions
          </p>

        </div>


        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium"
        >
          + Make Payment
        </button>

      </div>


      {/* ERROR */}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}


      {/* SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        <div className="bg-white border border-slate-200 rounded-xl p-5">

          <p className="text-sm text-slate-500">
            Total Transactions
          </p>

          <p className="text-2xl font-bold text-slate-800 mt-2">
            {payments.length}
          </p>

        </div>


        <div className="bg-white border border-slate-200 rounded-xl p-5">

          <p className="text-sm text-slate-500">
            Completed Payments
          </p>

          <p className="text-2xl font-bold text-green-600 mt-2">
            {
              payments.filter(
                (payment) =>
                  payment.status === 'Completed'
              ).length
            }
          </p>

        </div>


        <div className="bg-white border border-slate-200 rounded-xl p-5">

          <p className="text-sm text-slate-500">
            Total Paid
          </p>

          <p className="text-2xl font-bold text-blue-600 mt-2">
            USD {completedAmount.toLocaleString()}
          </p>

        </div>

      </div>


      {/* PAYMENT TABLE */}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-200">

          <h2 className="text-lg font-semibold text-slate-800">
            Payment Transactions
          </h2>

        </div>


        {loading ? (

          <div className="p-10 text-center text-slate-500">
            Loading payments...
          </div>

        ) : payments.length === 0 ? (

          <div className="p-10 text-center">

            <div className="text-5xl mb-4">
              💳
            </div>

            <p className="text-slate-500 mb-4">
              No payment transactions yet.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Make your first payment
            </button>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Payment Reference
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Shipment
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Amount
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Method
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Date
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {payments.map((payment) => (

                  <tr
                    key={payment.id}
                    className="hover:bg-slate-50"
                  >

                    <td className="px-6 py-4">

                      <p className="font-semibold text-slate-800">
                        {payment.payment_reference}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        ID: {payment.id}
                      </p>

                    </td>


                    <td className="px-6 py-4 text-slate-700">
                      {payment.shipment_number ||
                        'Not Assigned'}
                    </td>


                    <td className="px-6 py-4">

                      <span className="font-semibold text-slate-800">
                        {payment.currency} {Number(
                          payment.amount
                        ).toLocaleString()}
                      </span>

                    </td>


                    <td className="px-6 py-4 text-slate-700">
                      {payment.payment_method}
                    </td>


                    <td className="px-6 py-4">

                      <span
                        className={`px-3 py-2 rounded-full text-sm ${getStatusClass(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>

                    </td>


                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {payment.payment_date
                        ? new Date(
                            payment.payment_date
                          ).toLocaleDateString()
                        : '-'}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* PAYMENT MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-lg">

            {/* HEADER */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

              <div>

                <h2 className="text-xl font-bold text-slate-800">
                  Make Payment
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Complete your shipment payment
                </p>

              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl"
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* SHIPMENT */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Shipment
                </label>

                <select
                  name="shipment_id"
                  value={formData.shipment_id}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">
                    Select shipment
                  </option>

                  {shipments.map((shipment) => (

                    <option
                      key={shipment.id}
                      value={shipment.id}
                    >
                      {shipment.shipment_number}
                    </option>

                  ))}

                </select>

              </div>


              {/* AMOUNT */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  placeholder="Enter amount"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>


              {/* CURRENCY */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Currency
                </label>

                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="USD">
                    USD
                  </option>

                  <option value="INR">
                    INR
                  </option>

                  <option value="EUR">
                    EUR
                  </option>

                </select>

              </div>


              {/* PAYMENT METHOD */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Method
                </label>

                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="Online">
                    Online
                  </option>

                  <option value="Bank Transfer">
                    Bank Transfer
                  </option>

                  <option value="UPI">
                    UPI
                  </option>

                </select>

              </div>


              {/* NOTICE */}

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">

                <p className="text-sm text-blue-700">
                  This is an academic payment simulation.
                  No real money will be charged.
                </p>

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium"
                >
                  {saving
                    ? 'Processing...'
                    : 'Complete Payment'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}

export default Payments