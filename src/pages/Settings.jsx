import { useEffect, useState } from 'react'

function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    shipmentUpdates: true,
    paymentNotifications: true,
    documentNotifications: true,
    language: 'English',
    currency: 'USD',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:5000/api/settings',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch settings'
        )
      }

      setSettings({
        emailNotifications:
          data.email_notifications,
        shipmentUpdates:
          data.shipment_updates,
        paymentNotifications:
          data.payment_notifications,
        documentNotifications:
          data.document_notifications,
        language: data.language || 'English',
        currency: data.currency || 'USD',
      })

    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = (name) => {
    setSettings({
      ...settings,
      [name]: !settings[name],
    })

    setSaved(false)
    setError('')
  }

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    })

    setSaved(false)
    setError('')
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setSaved(false)
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:5000/api/settings',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email_notifications:
              settings.emailNotifications,

            shipment_updates:
              settings.shipmentUpdates,

            payment_notifications:
              settings.paymentNotifications,

            document_notifications:
              settings.documentNotifications,

            language: settings.language,

            currency: settings.currency,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to save settings'
        )
      }

      setSaved(true)

    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow-sm">
        <p className="text-slate-500">
          Loading settings...
        </p>
      </div>
    )
  }

  return (
    <div>

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-800">
          Settings
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your application preferences and notifications.
        </p>

      </div>

      {/* Success Message */}
      {saved && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          Settings saved successfully.
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Preferences */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

        <h2 className="text-xl font-semibold text-slate-800">
          General Preferences
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Choose your preferred language and currency.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Language
            </label>

            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Marathi</option>
            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Default Currency
            </label>

            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>INR</option>
            </select>

          </div>

        </div>

      </div>

      {/* Notification Settings */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

        <h2 className="text-xl font-semibold text-slate-800">
          Notification Preferences
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Choose which notifications you want to receive.
        </p>

        <div className="mt-6 divide-y divide-slate-100">

          {/* Email Notifications */}
          <div className="flex items-center justify-between py-4">

            <div>
              <p className="font-medium text-slate-800">
                Email Notifications
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Receive important system notifications by email.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                handleToggle('emailNotifications')
              }
              className={`relative h-6 w-11 rounded-full transition ${
                settings.emailNotifications
                  ? 'bg-blue-600'
                  : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  settings.emailNotifications
                    ? 'left-6'
                    : 'left-1'
                }`}
              />
            </button>

          </div>

          {/* Shipment Updates */}
          <div className="flex items-center justify-between py-4">

            <div>
              <p className="font-medium text-slate-800">
                Shipment Updates
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Get notified when shipment status changes.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                handleToggle('shipmentUpdates')
              }
              className={`relative h-6 w-11 rounded-full transition ${
                settings.shipmentUpdates
                  ? 'bg-blue-600'
                  : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  settings.shipmentUpdates
                    ? 'left-6'
                    : 'left-1'
                }`}
              />
            </button>

          </div>

          {/* Payment Notifications */}
          <div className="flex items-center justify-between py-4">

            <div>
              <p className="font-medium text-slate-800">
                Payment Notifications
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Receive payment confirmations and updates.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                handleToggle('paymentNotifications')
              }
              className={`relative h-6 w-11 rounded-full transition ${
                settings.paymentNotifications
                  ? 'bg-blue-600'
                  : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  settings.paymentNotifications
                    ? 'left-6'
                    : 'left-1'
                }`}
              />
            </button>

          </div>

          {/* Document Notifications */}
          <div className="flex items-center justify-between py-4">

            <div>
              <p className="font-medium text-slate-800">
                Document Notifications
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Get notified when documents are approved or rejected.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                handleToggle('documentNotifications')
              }
              className={`relative h-6 w-11 rounded-full transition ${
                settings.documentNotifications
                  ? 'bg-blue-600'
                  : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  settings.documentNotifications
                    ? 'left-6'
                    : 'left-1'
                }`}
              />
            </button>

          </div>

        </div>

      </div>

      {/* Security */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

        <h2 className="text-xl font-semibold text-slate-800">
          Security
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage your account security.
        </p>

        <div className="mt-5 flex flex-col justify-between gap-4 rounded-lg bg-slate-50 p-4 md:flex-row md:items-center">

          <div>
            <p className="font-medium text-slate-800">
              Password
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Password changes are handled securely through your account.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              alert(
                'Password change feature will be connected next.'
              )
            }
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Change Password
          </button>

        </div>

      </div>

      {/* Save */}
      <div className="flex justify-end">

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? 'Saving...'
            : 'Save Settings'}
        </button>

      </div>

    </div>
  )
}

export default Settings
