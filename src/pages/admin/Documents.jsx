import { useEffect, useState } from 'react'

function Documents() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        'https://smart-cargo.onrender.com/api/admin/documents',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load documents')
      }

      setDocuments(data)
    } catch (error) {
      console.error('ADMIN DOCUMENTS ERROR:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const updateStatus = async (documentId, status) => {
    try {
      const response = await fetch(
        `https://smart-cargo.onrender.com/api/admin/documents/${documentId}/status`,
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
        throw new Error(data.message || 'Failed to update status')
      }

      setDocuments((currentDocuments) =>
        currentDocuments.map((document) =>
          document.id === documentId
            ? { ...document, status }
            : document
        )
      )
    } catch (error) {
      console.error('UPDATE DOCUMENT STATUS ERROR:', error)
      alert(error.message)
    }
  }

  const pendingCount = documents.filter(
    (document) => document.status === 'Pending'
  ).length

  const approvedCount = documents.filter(
    (document) => document.status === 'Approved'
  ).length

  const rejectedCount = documents.filter(
    (document) => document.status === 'Rejected'
  ).length

  const getStatusStyle = (status) => {
    if (status === 'Approved') {
      return 'bg-green-100 text-green-700'
    }

    if (status === 'Rejected') {
      return 'bg-red-100 text-red-700'
    }

    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Document Management
        </h1>

        <p className="mt-2 text-gray-500">
          Review and manage export documents submitted by business users.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Documents</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {documents.length}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Pending</p>
          <h2 className="mt-2 text-3xl font-bold text-yellow-600">
            {pendingCount}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Approved</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {approvedCount}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Rejected</p>
          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {rejectedCount}
          </h2>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            All Documents
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            View and manage documents submitted by business users.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading documents...
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 font-medium">
              {error}
            </p>

            <button
              onClick={fetchDocuments}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No documents found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Document
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Type
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Business / Owner
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Shipment
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Route
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Uploaded
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {documents.map((document) => (
                  <tr
                    key={document.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">
                        {document.document_name}
                      </p>

                      {document.file_path && (
                        <p className="text-xs text-gray-400 mt-1">
                          File available
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {document.document_type}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {document.business_name || 'No business profile'}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Owner: {document.owner_name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {document.owner_email}
                      </p>
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-700">
                      {document.shipment_number || 'Not Assigned'}
                    </td>

                    <td className="px-6 py-4">
                      {document.origin && document.destination ? (
                        <div className="text-gray-600">
                          <div>{document.origin}</div>
                          <div className="text-gray-400">↓</div>
                          <div>{document.destination}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">
                          Not Available
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          document.status
                        )}`}
                      >
                        {document.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {document.uploaded_at
                        ? new Date(
                            document.uploaded_at
                          ).toLocaleDateString()
                        : 'Not Available'}
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={document.status}
                        onChange={(event) =>
                          updateStatus(
                            document.id,
                            event.target.value
                          )
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
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

export default Documents