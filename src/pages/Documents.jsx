import { useState } from 'react'

function Documents() {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Commercial Invoice.pdf',
      type: 'Commercial Invoice',
      shipment: 'SC-10024',
      date: '28 Sep 2026',
      status: 'Approved',
    },
    {
      id: 2,
      name: 'Packing List.pdf',
      type: 'Packing List',
      shipment: 'SC-10024',
      date: '28 Sep 2026',
      status: 'Pending',
    },
    {
      id: 3,
      name: 'Insurance Certificate.pdf',
      type: 'Insurance',
      shipment: 'SC-10023',
      date: '27 Sep 2026',
      status: 'Approved',
    },
  ])

  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
    name: '',
    type: 'Commercial Invoice',
    shipment: 'SC-10024',
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleUpload = () => {
    if (!form.name) {
      alert('Please enter a document name.')
      return
    }

    const newDocument = {
      id: documents.length + 1,
      name: form.name,
      type: form.type,
      shipment: form.shipment,
      date: '02 Oct 2026',
      status: 'Pending',
    }

    setDocuments([...documents, newDocument])

    setForm({
      name: '',
      type: 'Commercial Invoice',
      shipment: 'SC-10024',
    })

    setShowModal(false)
  }

  const deleteDocument = (id) => {
    setDocuments(
      documents.filter((document) => document.id !== id)
    )
  }

  return (
    <div>

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Export Documents
          </h1>

          <p className="mt-2 text-slate-500">
            Upload and manage documents required for your shipments.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          + Upload Document
        </button>

      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-5 md:grid-cols-3">

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Documents
          </p>

          <p className="mt-2 text-3xl font-bold">
            {documents.length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Approved
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {documents.filter(
              (document) => document.status === 'Approved'
            ).length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Pending Review
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {documents.filter(
              (document) => document.status === 'Pending'
            ).length}
          </p>
        </div>

      </div>

      {/* Documents Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold">
                  Document
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Type
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Shipment
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Uploaded
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Status
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {documents.map((document) => (

                <tr
                  key={document.id}
                  className="border-b last:border-b-0 hover:bg-slate-50"
                >

                  <td className="px-6 py-4 font-medium">
                    {document.name}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {document.type}
                  </td>

                  <td className="px-6 py-4">
                    {document.shipment}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {document.date}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        document.status === 'Approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {document.status}
                    </span>

                  </td>

                  <td className="px-6 py-4">

                    <button
                      onClick={() =>
                        deleteDocument(document.id)
                      }
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Upload Modal */}
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Upload Document
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
                  Document Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Commercial Invoice.pdf"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Document Type
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option>Commercial Invoice</option>
                  <option>Packing List</option>
                  <option>Certificate</option>
                  <option>Insurance</option>
                </select>
              </div>

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
                  Select File
                </label>

                <input
                  type="file"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
                />
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
                onClick={handleUpload}
                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
              >
                Upload
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default Documents