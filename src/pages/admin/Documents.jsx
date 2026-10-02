import { useState } from 'react'

function Documents() {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Commercial Invoice.pdf',
      type: 'Commercial Invoice',
      shipment: 'SC-10024',
      business: 'ABC Electronics Pvt. Ltd.',
      uploaded: '28 Sep 2026',
      status: 'Approved',
    },
    {
      id: 2,
      name: 'Packing List.pdf',
      type: 'Packing List',
      shipment: 'SC-10024',
      business: 'ABC Electronics Pvt. Ltd.',
      uploaded: '28 Sep 2026',
      status: 'Pending',
    },
    {
      id: 3,
      name: 'Insurance Certificate.pdf',
      type: 'Insurance',
      shipment: 'SC-10023',
      business: 'Cotton Exporters Ltd.',
      uploaded: '27 Sep 2026',
      status: 'Approved',
    },
    {
      id: 4,
      name: 'Certificate of Origin.pdf',
      type: 'Certificate',
      shipment: 'SC-10022',
      business: 'Industrial Parts Co.',
      uploaded: '25 Sep 2026',
      status: 'Rejected',
    },
  ])

  const updateStatus = (id, newStatus) => {
    setDocuments(
      documents.map((document) =>
        document.id === id
          ? { ...document, status: newStatus }
          : document
      )
    )
  }

  const getStatusStyle = (status) => {
    if (status === 'Approved') {
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
          Document Management
        </h1>

        <p className="mt-2 text-slate-500">
          Review and manage shipment documents submitted by businesses.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Documents
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {documents.length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Approved
          </p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {
              documents.filter(
                (document) => document.status === 'Approved'
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Pending Review
          </p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {
              documents.filter(
                (document) => document.status === 'Pending'
              ).length
            }
          </p>
        </div>
      </div>

      {/* Documents Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-800">
            All Shipment Documents
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Document
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Type
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Shipment
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Business
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Uploaded
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
              {documents.map((document) => (
                <tr
                  key={document.id}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {document.name}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {document.type}
                  </td>

                  <td className="px-6 py-4 font-medium text-blue-600">
                    {document.shipment}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {document.business}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {document.uploaded}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                        document.status
                      )}`}
                    >
                      {document.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={document.status}
                      onChange={(e) =>
                        updateStatus(
                          document.id,
                          e.target.value
                        )
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                      <option>Pending</option>
                      <option>Approved</option>
                      <option>Rejected</option>
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

export default Documents