import { useEffect, useState } from 'react'

function Settings() {
  const [settings, setSettings] = useState({
    email_notifications: true,
    shipment_updates: true,
    payment_notifications: true,
    document_notifications: true,
    language: 'English',
    currency: 'USD',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        'https://smart-cargo.onrender.com/api/admin/settings',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load admin settings'
        )
      }

      setSettings({
        email_notifications:
          data.email_notifications ?? true,
        shipment_updates:
          data.shipment_updates ?? true,
        payment_notifications:
          data.payment_notifications ?? true,
        document_notifications:
          data.document_notifications ?? true,
        language: data.language || 'English',
        currency: data.currency || 'USD',
      })
    } catch (error) {
      console.error('ADMIN SETTINGS ERROR:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleToggle = (field) => {
    setSettings((current) => ({
      ...current,
      [field]: !current[field],
    }))
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setSettings((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      setMessage('')
      setError('')

      const response = await fetch(
        'https://smart-cargo.onrender.com/api/admin/settings',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(settings),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to save admin settings'
        )
      }

      setMessage(
        data.message || 'Settings saved successfully'
      )
    } catch (error) {
      console.error('SAVE ADMIN SETTINGS ERROR:', error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading settings...
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Settings
        </h1>

        <p className="mt-2 text-gray-500">
          Manage administrator notification and platform preferences.
        </p>
      </div>

      {message && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      )}

      <div className="max-w-4xl space-y-6">
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Notifications
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Configure notifications for the administrator account.
            </p>
          </div>

          <div className="divide-y">
            <div className="flex items-center justify-between p-6">
              <div>
                <h3 className="font-medium text-gray-800">
                  Email Notifications
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Receive important platform notifications by email.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleToggle('email_notifications')
                }
                className={`relative h-6 w-11 rounded-full transition ${
                  settings.email_notifications
                    ? 'bg-blue-600'
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    settings.email_notifications
                      ? 'left-6'
                      : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-6">
              <div>
                <h3 className="font-medium text-gray-800">
                  Shipment Updates
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Receive notifications about shipment status changes.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleToggle('shipment_updates')
                }
                className={`relative h-6 w-11 rounded-full transition ${
                  settings.shipment_updates
                    ? 'bg-blue-600'
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    settings.shipment_updates
                      ? 'left-6'
                      : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-6">
              <div>
                <h3 className="font-medium text-gray-800">
                  Payment Notifications
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Receive notifications about payment activities.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleToggle('payment_notifications')
                }
                className={`relative h-6 w-11 rounded-full transition ${
                  settings.payment_notifications
                    ? 'bg-blue-600'
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    settings.payment_notifications
                      ? 'left-6'
                      : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-6">
              <div>
                <h3 className="font-medium text-gray-800">
                  Document Notifications
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Receive notifications about document reviews.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleToggle('document_notifications')
                }
                className={`relative h-6 w-11 rounded-full transition ${
                  settings.document_notifications
                    ? 'bg-blue-600'
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    settings.document_notifications
                      ? 'left-6'
                      : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Platform Preferences
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Configure the administrator's language and currency preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Language
              </label>

              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="English">
                  English
                </option>

                <option value="Hindi">
                  Hindi
                </option>

                <option value="Marathi">
                  Marathi
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Currency
              </label>

              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="USD">
                  USD - US Dollar
                </option>

                <option value="INR">
                  INR - Indian Rupee
                </option>

                <option value="EUR">
                  EUR - Euro
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-7 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings