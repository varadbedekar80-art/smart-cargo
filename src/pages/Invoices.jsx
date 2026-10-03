import { useEffect, useState } from 'react'

function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:5000/api/invoices',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch invoices'
        )
      }

      setInvoices(data)
    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return '-'

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    )
  }

  const formatAmount = (amount, currency) => {
    return `${currency || 'USD'} ${Number(amount).toLocaleString()}`
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Invoices
        </h1>

        <p className="mt-2 text-slate-500">
          View and manage invoices for your shipments.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="mb-6 grid gap-5 md:grid-cols-3">

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Invoices
          </p>

          <p className="mt-2 text-3xl font-bold">
            {invoices.length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Generated Invoices
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {
              invoices.filter(
                (invoice) =>
                  invoice.status === 'Generated'
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Amount
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {invoices.reduce(
              (total, invoice) =>
                total + Number(invoice.amount || 0),
              0
            ).toLocaleString()}
          </p>
        </div>

      </div>

      {/* Invoice Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading invoices...
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No invoices found.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="border-b bg-slate-50">

                <tr>
                  <th className="px-6 py-4 text-sm font-semibold">
                    Invoice
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold">
                    Shipment
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold">
                    Payment
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold">
                    Date
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold">
                    Status
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold">
                    Action
                  </th>
                </tr>

              </thead>

              <tbody>

                {invoices.map((invoice) => (

                  <tr
                    key={invoice.id}
                    className="border-b last:border-b-0 hover:bg-slate-50"
                  >

                    <td className="px-6 py-4 font-semibold">
                      {invoice.invoice_number}
                    </td>

                    <td className="px-6 py-4">
                      {invoice.shipment_number || 'Not Linked'}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {invoice.payment_reference || '-'}
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      {formatAmount(
                        invoice.amount,
                        invoice.currency
                      )}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(invoice.invoice_date)}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          invoice.status === 'Generated'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {invoice.status}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <button
                        onClick={() =>
                          alert(
                            `Invoice ${invoice.invoice_number} selected`
                          )
                        }
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100"
                      >
                        View
                      </button>

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

export default Invoices
