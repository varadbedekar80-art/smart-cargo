function Invoices() {
  const invoices = [
    {
      id: 1,
      invoice: 'INV-2026-001',
      shipment: 'SC-10024',
      customer: 'ABC Electronics Pvt. Ltd.',
      amount: '$2,450',
      date: '28 Sep 2026',
      status: 'Paid',
    },
    {
      id: 2,
      invoice: 'INV-2026-002',
      shipment: 'SC-10023',
      customer: 'Cotton Exporters Ltd.',
      amount: '$1,850',
      date: '27 Sep 2026',
      status: 'Pending',
    },
    {
      id: 3,
      invoice: 'INV-2026-003',
      shipment: 'SC-10022',
      customer: 'Industrial Parts Co.',
      amount: '$3,200',
      date: '25 Sep 2026',
      status: 'Paid',
    },
  ]

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
            Paid Invoices
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {invoices.filter(
              (invoice) => invoice.status === 'Paid'
            ).length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Pending Invoices
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {invoices.filter(
              (invoice) => invoice.status === 'Pending'
            ).length}
          </p>
        </div>

      </div>

      {/* Invoice Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

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
                  Customer
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
                    {invoice.invoice}
                  </td>

                  <td className="px-6 py-4">
                    {invoice.shipment}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {invoice.customer}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    {invoice.amount}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {invoice.date}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        invoice.status === 'Paid'
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
                          `Invoice ${invoice.invoice} selected`
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

      </div>
    </div>
  )
}

export default Invoices