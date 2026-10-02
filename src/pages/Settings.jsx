import { useState } from 'react'

function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    shipmentUpdates: true,
    paymentNotifications: true,
    documentNotifications: true,
    language: 'English',
    currency: 'USD',
  })

  const [saved, setSaved] = useState(false)

  const handleToggle = (name) => {
    setSettings({
      ...settings,
      [name]: !settings[name],
    })

    setSaved(false)
  }

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    })

    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
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
              onClick={() => handleToggle('emailNotifications')}
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
              onClick={() => handleToggle('shipmentUpdates')}
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
              onClick={() => handleToggle('paymentNotifications')}
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
              onClick={() => handleToggle('documentNotifications')}
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
              Last changed recently.
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert('Change password feature will be connected to the backend later.')}
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
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          Save Settings
        </button>

      </div>

    </div>
  )
}

export default Settings