import { useState } from 'react'

function Payments() {
  const [payments, setPayments] = useState([
    {
      id: 1,
      transaction: 'TXN-50021',
      shipment: 'SC-10024',
      business: 'ABC Electronics Pvt. Ltd.',
      amount: '$2,450',
      method: 'Card',
      date: '28 Sep 2026',
      status: 'Paid',
    },
    {
      id: 2,
      transaction: 'TXN-50020',
      shipment: 'SC-10023',
      business: 'Cotton Exporters Ltd.',
      amount: '$1,850',
      method: 'UPI',
      date: '27 Sep 2026',
      status: 'Pending',
    },
    {
      id: 3,
      transaction: 'TXN-50019',
      shipment: 'SC-10022',
      business: 'Industrial Parts Co.',
      amount: '$3,200',
      method: 'Bank Transfer',
      date: '25 Sep 2026',
      status: 'Paid',
    },
    {
      id: 4,
      transaction: 'TXN-50018',
      shipment: 'SC-10021',
      business: 'Metro Auto Exports',
      amount: '$2,780',
      method: 'Card',
      date: '24 Sep 2026',
      status: 'Failed',
    },
  ])

  const updateStatus = (id, newStatus) => {
    setPayments(
      payments.map((payment) =>
        payment.id === id
          ? { ...payment, status: newStatus }
          : payment
      )
    )
  }

  const getStatusStyle = (status) => {
    if (status === 'Paid') {
      return 'bg-green-100 text-green-700'
    }

    if (status === 'Pending') {
      return 'bg-yellow-100 text-yellow-700'
    }

    return 'bg-red-100 text-red-700'
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Payment Management
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor and manage payment transactions across the platform.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Transactions
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {payments.length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Successful Payments
          </p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {
              payments.filter(
                (payment) => payment.status === 'Paid'
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Pending Payments
          </p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {
              payments.filter(
                (payment) => payment.status === 'Pending'
              ).length
            }
          </p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-800">
            All Payment Transactions
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Transaction ID
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Shipment
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Business
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Amount
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Method
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Date
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-blue-600">
                    {payment.transaction}
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-700">
                    {payment.shipment}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {payment.business}
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-700">
                    {payment.amount}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {payment.method}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {payment.date}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={payment.status}
                      onChange={(e) =>
                        updateStatus(
                          payment.id,
                          e.target.value
                        )
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                      <option>Pending</option>
                      <option>Paid</option>
                      <option>Failed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Payments