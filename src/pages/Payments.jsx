import { useState } from 'react'

function Payments() {
  const [payments, setPayments] = useState([
    {
      id: 1,
      transaction: 'TXN-50021',
      shipment: 'SC-10024',
      amount: '$2,450',
      date: '28 Sep 2026',
      method: 'Card',
      status: 'Paid',
    },
    {
      id: 2,
      transaction: 'TXN-50020',
      shipment: 'SC-10023',
      amount: '$1,850',
      date: '27 Sep 2026',
      method: 'UPI',
      status: 'Pending',
    },
    {
      id: 3,
      transaction: 'TXN-50019',
      shipment: 'SC-10022',
      amount: '$3,200',
      date: '25 Sep 2026',
      method: 'Bank Transfer',
      status: 'Paid',
    },
  ])

  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
    shipment: 'SC-10024',
    amount: '',
    method: 'Card',
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handlePayment = () => {
    if (!form.amount) {
      alert('Please enter the payment amount.')
      return
    }

    const newPayment = {
      id: payments.length + 1,
      transaction: `TXN-${50022 + payments.length}`,
      shipment: form.shipment,
      amount: `$${Number(form.amount).toLocaleString()}`,
      date: '02 Oct 2026',
      method: form.method,
      status: 'Paid',
    }

    setPayments([...payments, newPayment])

    setForm({
      shipment: 'SC-10024',
      amount: '',
      method: 'Card',
    })

    setShowModal(false)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Payments
          </h1>

          <p className="mt-2 text-slate-500">
            Manage shipment payments and transaction records.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          + Make Payment
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Transactions
          </p>

          <p className="mt-2 text-3xl font-bold">
            {payments.length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Successful Payments
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {payments.filter(
              (payment) => payment.status === 'Paid'
            ).length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Pending Payments
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {payments.filter(
              (payment) => payment.status === 'Pending'
            ).length}
          </p>
        </div>
      </div>

      {/* Payment Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold">
                  Transaction ID
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Shipment
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Amount
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Date
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Method
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b last:border-b-0 hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium">
                    {payment.transaction}
                  </td>

                  <td className="px-6 py-4">
                    {payment.shipment}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    {payment.amount}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {payment.date}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {payment.method}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        payment.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Make Payment
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-xl text-slate-500 hover:text-slate-800"
              >
                ×
              </button>
            </div>

            <div className="space-y-5">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Shipment
                </label>

                <select
                  name="shipment"
                  value={form.shipment}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option>SC-10024</option>
                  <option>SC-10023</option>
                  <option>SC-10022</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Amount (USD)
                </label>

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="e.g. 2450"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Payment Method
                </label>

                <select
                  name="method"
                  value={form.method}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option>Card</option>
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                </select>
              </div>

            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-slate-300 px-5 py-3 font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handlePayment}
                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
              >
                Pay Now
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default Payments