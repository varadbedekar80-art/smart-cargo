function Services({ onLogin, onRegister, onNavigate }) {
  const services = [
    {
      icon: '📦',
      title: 'Cargo Management',
      description:
        'Manage product information, categories, quantities, weights, dimensions, packages and declared cargo values.',
      features: [
        'Cargo details management',
        'Package information',
        'Weight and dimensions',
        'Declared value tracking',
      ],
    },
    {
      icon: '🚚',
      title: 'Shipment Management',
      description:
        'Create and manage shipment requests with pickup, origin, destination and transportation details.',
      features: [
        'Create shipments',
        'Origin and destination',
        'Air, Sea and Road',
        'Shipment status',
      ],
    },
    {
      icon: '💰',
      title: 'Shipping Cost Estimation',
      description:
        'Estimate shipping costs using cargo weight, dimensions, destination and selected transportation method.',
      features: [
        'Cost estimation',
        'Transport method selection',
        'Destination-based calculation',
        'Delivery estimates',
      ],
    },
    {
      icon: '🏢',
      title: 'Logistics Providers',
      description:
        'Browse available logistics providers and manage provider assignments for shipments.',
      features: [
        'Provider information',
        'Available services',
        'Shipment assignment',
        'Provider management',
      ],
    },
    {
      icon: '📄',
      title: 'Export Documents',
      description:
        'Organize important export documents and monitor their verification status.',
      features: [
        'Commercial invoices',
        'Packing lists',
        'Certificates',
        'Insurance documents',
      ],
    },
    {
      icon: '💳',
      title: 'Payments & Invoices',
      description:
        'Manage shipment payments and maintain transaction and invoice information.',
      features: [
        'Payment records',
        'Payment status',
        'Transaction history',
        'Invoice management',
      ],
    },
    {
      icon: '📍',
      title: 'Shipment Tracking',
      description:
        'Track shipments using their unique tracking numbers and view their current transportation status.',
      features: [
        'Unique tracking numbers',
        'Shipment status',
        'Transport progress',
        'Delivery information',
      ],
    },
    {
      icon: '📊',
      title: 'Dashboard & Reports',
      description:
        'View shipment summaries and reports to understand business and logistics activity.',
      features: [
        'Shipment summaries',
        'Active shipments',
        'Completed shipments',
        'Pending shipments',
      ],
    },
    {
      icon: '🔔',
      title: 'Notifications',
      description:
        'Stay informed about shipment updates, payments, documents and other important activities.',
      features: [
        'Shipment notifications',
        'Payment confirmations',
        'Document updates',
        'Booking confirmations',
      ],
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
              className="text-sm font-semibold text-blue-600"
            >
              Services
            </button>

            <button
              onClick={() => onNavigate('How It Works')}
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
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
            Our Services
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Everything You Need to Manage Cargo
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Smart Cargo brings cargo management, shipment planning, logistics,
            documents, payments and tracking together in one centralized
            platform.
          </p>

        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Platform Features
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              Complete Logistics Management
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              Manage the major stages of your cargo export process from one
              convenient platform.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {services.map((service) => (
              <div
                key={service.title}
                className="group rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-2xl transition group-hover:bg-blue-600">
                  {service.icon}
                </div>

                <h3 className="mt-6 text-xl font-semibold text-slate-800">
                  {service.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  {service.description}
                </p>

                <div className="mt-5 space-y-2">

                  {service.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <span className="font-bold text-blue-600">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}

                </div>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Transportation */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Transportation Options
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                Choose the Right Transport Method
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                Smart Cargo supports multiple transportation methods so
                businesses can select an appropriate option for their shipment
                requirements.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">

              <div className="rounded-xl bg-slate-50 p-6 text-center">
                <div className="text-4xl">✈️</div>

                <h3 className="mt-4 font-semibold text-slate-800">
                  Air Freight
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Suitable for faster transportation.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-6 text-center">
                <div className="text-4xl">🚢</div>

                <h3 className="mt-4 font-semibold text-slate-800">
                  Sea Freight
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Suitable for larger cargo shipments.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-6 text-center">
                <div className="text-4xl">🚛</div>

                <h3 className="mt-4 font-semibold text-slate-800">
                  Road Freight
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Suitable for road-based transportation.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Role-Based Services */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Role-Based Access
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              Tools for Every Platform User
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-xl bg-white p-7 shadow-sm">
              <div className="text-3xl">👤</div>

              <h3 className="mt-5 text-xl font-semibold text-slate-800">
                Business Users
              </h3>

              <ul className="mt-4 space-y-3 text-sm text-slate-500">
                <li>✓ Manage cargo</li>
                <li>✓ Create shipments</li>
                <li>✓ Estimate shipping costs</li>
                <li>✓ Manage documents</li>
                <li>✓ Make payments</li>
                <li>✓ Track shipments</li>
              </ul>
            </div>

            <div className="rounded-xl bg-white p-7 shadow-sm">
              <div className="text-3xl">🛡️</div>

              <h3 className="mt-5 text-xl font-semibold text-slate-800">
                Administrators
              </h3>

              <ul className="mt-4 space-y-3 text-sm text-slate-500">
                <li>✓ Manage users</li>
                <li>✓ Manage businesses</li>
                <li>✓ Monitor shipments</li>
                <li>✓ Review documents</li>
                <li>✓ Monitor payments</li>
                <li>✓ Manage providers</li>
              </ul>
            </div>

            <div className="rounded-xl bg-white p-7 shadow-sm">
              <div className="text-3xl">🚚</div>

              <h3 className="mt-5 text-xl font-semibold text-slate-800">
                Logistics Providers
              </h3>

              <ul className="mt-4 space-y-3 text-sm text-slate-500">
                <li>✓ View assigned shipments</li>
                <li>✓ Manage operations</li>
                <li>✓ Update pickup status</li>
                <li>✓ Update transport status</li>
                <li>✓ Update delivery status</li>
                <li>✓ Maintain shipment visibility</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 px-6 py-16 text-center text-white">

        <h2 className="text-3xl font-bold">
          Start Managing Your Cargo Smarter
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Bring your shipment management, documents, payments and tracking
          together in one platform.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

          <button
            onClick={onRegister}
            className="rounded-lg bg-blue-600 px-7 py-3 font-medium hover:bg-blue-700"
          >
            Create an Account
          </button>

          <button
            onClick={onLogin}
            className="rounded-lg border border-slate-600 px-7 py-3 font-medium text-white hover:bg-slate-800"
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

export default Services