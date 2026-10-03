import { useEffect, useState } from 'react'

function Documents() {
  const [documents, setDocuments] = useState([])
  const [shipments, setShipments] = useState([])

  const [showModal, setShowModal] = useState(false)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    shipment_id: '',
    document_name: '',
    document_type: '',
    file_path: '',
  })


  // ==============================
  // FETCH DOCUMENTS
  // ==============================

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:5000/api/documents',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch documents'
        )
      }

      setDocuments(data)

    } catch (error) {
      console.error(error)

      setError(
        error.message || 'Unable to load documents'
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
        'http://localhost:5000/api/shipments',
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
    fetchDocuments()
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
  // ADD DOCUMENT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:5000/api/documents',
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

            document_name: formData.document_name,

            document_type: formData.document_type,

            file_path: formData.file_path || null,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to add document'
        )
      }

      await fetchDocuments()

      setFormData({
        shipment_id: '',
        document_name: '',
        document_type: '',
        file_path: '',
      })

      setShowModal(false)

    } catch (error) {
      console.error(error)

      setError(
        error.message || 'Unable to add document'
      )
    } finally {
      setSaving(false)
    }
  }


  // ==============================
  // UPDATE STATUS
  // ==============================

  const handleStatusChange = async (id, status) => {
    try {
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        `http://localhost:5000/api/documents/${id}/status`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to update document status'
        )
      }

      await fetchDocuments()

    } catch (error) {
      console.error(error)

      setError(
        error.message || 'Unable to update document status'
      )
    }
  }


  // ==============================
  // DELETE DOCUMENT
  // ==============================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this document?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        `http://localhost:5000/api/documents/${id}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to delete document'
        )
      }

      await fetchDocuments()

    } catch (error) {
      console.error(error)

      setError(
        error.message || 'Unable to delete document'
      )
    }
  }


  // ==============================
  // STATUS STYLE
  // ==============================

  const getStatusClass = (status) => {
    if (status === 'Approved') {
      return 'bg-green-100 text-green-700'
    }

    if (status === 'Rejected') {
      return 'bg-red-100 text-red-700'
    }

    return 'bg-yellow-100 text-yellow-700'
  }


  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Document Management
          </h1>

          <p className="text-slate-500 mt-1">
            Manage export and shipment documents
          </p>

        </div>


        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium"
        >
          + Add Document
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
            Total Documents
          </p>

          <p className="text-2xl font-bold text-slate-800 mt-2">
            {documents.length}
          </p>

        </div>


        <div className="bg-white border border-slate-200 rounded-xl p-5">

          <p className="text-sm text-slate-500">
            Pending
          </p>

          <p className="text-2xl font-bold text-yellow-600 mt-2">
            {
              documents.filter(
                (document) =>
                  document.status === 'Pending'
              ).length
            }
          </p>

        </div>


        <div className="bg-white border border-slate-200 rounded-xl p-5">

          <p className="text-sm text-slate-500">
            Approved
          </p>

          <p className="text-2xl font-bold text-green-600 mt-2">
            {
              documents.filter(
                (document) =>
                  document.status === 'Approved'
              ).length
            }
          </p>

        </div>

      </div>


      {/* DOCUMENT TABLE */}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-200">

          <h2 className="text-lg font-semibold text-slate-800">
            Your Documents
          </h2>

        </div>


        {loading ? (

          <div className="p-10 text-center text-slate-500">
            Loading documents...
          </div>

        ) : documents.length === 0 ? (

          <div className="p-10 text-center">

            <div className="text-5xl mb-4">
              📄
            </div>

            <p className="text-slate-500 mb-4">
              No documents uploaded yet.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first document
            </button>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Document
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Type
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Shipment
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Uploaded
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {documents.map((document) => (

                  <tr
                    key={document.id}
                    className="hover:bg-slate-50"
                  >

                    <td className="px-6 py-4">

                      <p className="font-medium text-slate-800">
                        {document.document_name}
                      </p>

                      {document.file_path && (
                        <p className="text-xs text-slate-400 mt-1">
                          {document.file_path}
                        </p>
                      )}

                    </td>


                    <td className="px-6 py-4 text-slate-700">
                      {document.document_type}
                    </td>


                    <td className="px-6 py-4 text-slate-700">
                      {document.shipment_number ||
                        'Not Assigned'}
                    </td>


                    <td className="px-6 py-4">

                      <select
                        value={document.status}
                        onChange={(e) =>
                          handleStatusChange(
                            document.id,
                            e.target.value
                          )
                        }
                        className={`px-3 py-2 rounded-full text-sm border-0 ${getStatusClass(
                          document.status
                        )}`}
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Approved">
                          Approved
                        </option>

                        <option value="Rejected">
                          Rejected
                        </option>

                      </select>

                    </td>


                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {document.uploaded_at
                        ? new Date(
                            document.uploaded_at
                          ).toLocaleDateString()
                        : '-'}
                    </td>


                    <td className="px-6 py-4">

                      <button
                        onClick={() =>
                          handleDelete(document.id)
                        }
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ADD DOCUMENT MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-lg">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

              <div>

                <h2 className="text-xl font-bold text-slate-800">
                  Add Document
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Add shipment or export document details
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

              {/* DOCUMENT NAME */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Document Name
                </label>

                <input
                  type="text"
                  name="document_name"
                  value={formData.document_name}
                  onChange={handleChange}
                  placeholder="Commercial Invoice"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>


              {/* DOCUMENT TYPE */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Document Type
                </label>

                <select
                  name="document_type"
                  value={formData.document_type}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">
                    Select document type
                  </option>

                  <option value="Commercial Invoice">
                    Commercial Invoice
                  </option>

                  <option value="Packing List">
                    Packing List
                  </option>

                  <option value="Certificate of Origin">
                    Certificate of Origin
                  </option>

                  <option value="Insurance Document">
                    Insurance Document
                  </option>

                  <option value="Export License">
                    Export License
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>


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


              {/* FILE REFERENCE */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  File Name / Reference
                </label>

                <input
                  type="text"
                  name="file_path"
                  value={formData.file_path}
                  onChange={handleChange}
                  placeholder="invoice_001.pdf"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <p className="text-xs text-slate-400 mt-2">
                  File upload storage will be added later.
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
                    ? 'Adding...'
                    : 'Add Document'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}

export default Documents