function HowItWorks({ onLogin, onRegister, onNavigate }) {
  const steps = [
    {
      number: '01',
      icon: '👤',
      title: 'Register Your Business',
      description:
        'Create your account and provide your basic business information to get started with Smart Cargo.',
    },
    {
      number: '02',
      icon: '📦',
      title: 'Add Your Cargo',
      description:
        'Enter product details such as category, quantity, weight, dimensions, package type and declared value.',
    },
    {
      number: '03',
      icon: '🚚',
      title: 'Create a Shipment',
      description:
        'Create a shipment request by providing pickup location, origin, destination and transportation method.',
    },
    {
      number: '04',
      icon: '💰',
      title: 'Estimate Shipping Cost',
      description:
        'Use cargo and shipment details to get an estimated shipping cost and expected delivery timeframe.',
    },
    {
      number: '05',
      icon: '🏢',
      title: 'Select a Provider',
      description:
        'Review available logistics providers and select a suitable provider for your shipment.',
    },
    {
      number: '06',
      icon: '📄',
      title: 'Upload Documents',
      description:
        'Upload required export documents such as commercial invoices, packing lists, certificates and insurance documents.',
    },
    {
      number: '07',
      icon: '💳',
      title: 'Make Payment',
      description:
        'Complete the shipment payment and keep track of payment transactions and invoice information.',
    },
    {
      number: '08',
      icon: '📍',
      title: 'Track Your Shipment',
      description:
        'Use the unique tracking number to monitor the shipment status from pickup through delivery.',
    },
    {
      number: '09',
      icon: '✅',
      title: 'Receive Your Delivery',
      description:
        'Follow the shipment until it reaches its destination and the delivery status is completed.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <button
            onClick={() => onNavigate('Home')}
            className="text-2xl font-bold text-blue-700"
          >
            Smart Cargo
          </button>

          <div className="hidden items-center gap-8 md:flex">

            <button
              onClick={() => onNavigate('Home')}
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('About')}
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              About
            </button>

            <button
              onClick={() => onNavigate('Services')}
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Services
            </button>

            <button
              onClick={() => onNavigate('How It Works')}
              className="text-sm font-semibold text-blue-600"
            >
              How It Works
            </button>

            <button
              onClick={() => onNavigate('Contact')}
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Contact
            </button>

          </div>

          <div className="flex gap-3">

            <button
              onClick={onLogin}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Login
            </button>

            <button
              onClick={onRegister}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Register
            </button>

          </div>

        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">

          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-200">
            How It Works
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            From Cargo Creation to Delivery
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Smart Cargo simplifies the cargo export process by bringing the
            major stages of shipment management together in one platform.
          </p>

        </div>
      </section>

      {/* Process Overview */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="mb-14 text-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Simple Process
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              How Smart Cargo Works
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              Follow these steps to manage your cargo shipment through the
              platform.
            </p>

          </div>

          {/* Steps */}
          <div className="relative">

            <div className="absolute left-7 top-8 hidden h-[calc(100%-60px)] w-px bg-blue-200 md:block" />

            <div className="space-y-8">

              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative flex flex-col gap-6 md:flex-row md:items-start"
                >

                  {/* Number */}
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-md">
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className="flex-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-2xl">
                        {step.icon}
                      </div>

                      <div>

                        <h3 className="text-xl font-semibold text-slate-800">
                          {step.title}
                        </h3>

                        <p className="mt-2 leading-7 text-slate-500">
                          {step.description}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>
      </section>

      {/* Shipment Lifecycle */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Shipment Lifecycle
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              Complete Visibility Throughout the Journey
            </h2>

          </div>

          <div className="grid gap-5 md:grid-cols-5">

            <div className="rounded-xl bg-slate-50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                1
              </div>

              <h3 className="mt-4 font-semibold text-slate-800">
                Created
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Shipment request is created.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
                2
              </div>

              <h3 className="mt-4 font-semibold text-slate-800">
                Pickup
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Cargo is collected from the pickup location.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                3
              </div>

              <h3 className="mt-4 font-semibold text-slate-800">
                In Transit
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Cargo is transported to the destination.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                4
              </div>

              <h3 className="mt-4 font-semibold text-slate-800">
                Destination
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Cargo reaches the destination.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                5
              </div>

              <h3 className="mt-4 font-semibold text-slate-800">
                Delivered
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Shipment is successfully delivered.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-xl bg-white p-7 shadow-sm">
              <div className="text-3xl">⚡</div>

              <h3 className="mt-5 text-xl font-semibold text-slate-800">
                Less Manual Work
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                Keep important shipment information organized in a centralized
                system instead of managing separate records.
              </p>
            </div>

            <div className="rounded-xl bg-white p-7 shadow-sm">
              <div className="text-3xl">🔍</div>

              <h3 className="mt-5 text-xl font-semibold text-slate-800">
                Better Visibility
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                Track shipment progress and access important documents,
                payments and status information.
              </p>
            </div>

            <div className="rounded-xl bg-white p-7 shadow-sm">
              <div className="text-3xl">📊</div>

              <h3 className="mt-5 text-xl font-semibold text-slate-800">
                Centralized Information
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                Bring cargo, shipments, logistics providers, documents and
                payments together on one platform.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 px-6 py-16 text-center text-white">

        <h2 className="text-3xl font-bold">
          Ready to Manage Your First Shipment?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Create your account and start managing your cargo export process
          with Smart Cargo.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

          <button
            onClick={onRegister}
            className="rounded-lg bg-blue-600 px-7 py-3 font-medium hover:bg-blue-700"
          >
            Get Started
          </button>

          <button
            onClick={onLogin}
            className="rounded-lg border border-slate-600 px-7 py-3 font-medium hover:bg-slate-800"
          >
            Login
          </button>

        </div>

      </section>

      {/* Footer */}
      <footer className="bg-slate-950 px-6 py-8 text-center text-sm text-slate-400">
        © 2026 Smart Cargo Export & Logistics Management System. All rights
        reserved.
      </footer>

    </div>
  )
}

export default HowItWorks