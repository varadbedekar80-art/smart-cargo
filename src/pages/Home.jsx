function Home({ onLogin, onRegister, onNavigate }) {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo - ONLY ONE */}
          <button
            onClick={() => onNavigate('Home')}
            className="flex items-center"
          >
            <img
              src="/cargo-logo.png"
              alt="Smart Cargo"
              className="h-25 w-auto object-contain"
            />
          </button>

          {/* Navigation */}
          <div className="hidden items-center gap-8 md:flex">

            <button
              onClick={() => onNavigate('Home')}
              className="text-sm font-semibold text-blue-600"
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('About')}
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              About
            </button>

            <button
              onClick={() => onNavigate('Services')}
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              Services
            </button>

            <button
              onClick={() => onNavigate('How It Works')}
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              How It Works
            </button>

            <button
              onClick={() => onNavigate('Contact')}
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              Contact
            </button>

          </div>

          {/* Login / Register */}
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
      <section
        id="home"
        className="bg-white"
      >

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">

          {/* Hero Text */}
          <div>

            <div className="mb-5 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              Smart Export & Logistics Management
            </div>

            <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
              Manage Your Cargo.
              <span className="block text-blue-600">
                Simplify Your Exports.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              A centralized platform to create shipments, estimate shipping
              costs, manage export documents, make payments, and track your
              cargo from one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <button
                onClick={onRegister}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-sm hover:bg-blue-700"
              >
                Get Started
              </button>

              <button
                onClick={onLogin}
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                Login to Dashboard
              </button>

            </div>

          </div>

          {/* Dashboard Preview */}
          <div className="rounded-2xl border border-slate-200 bg-slate-100 p-5 shadow-xl">

            <div className="rounded-xl bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Dashboard Overview
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-800">
                    Shipment Summary
                  </h2>
                </div>

                <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600">
                  2026
                </div>

              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">

                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-slate-500">
                    Total Shipments
                  </p>

                  <p className="mt-2 text-2xl font-bold text-blue-600">
                    24
                  </p>
                </div>

                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-slate-500">
                    Completed
                  </p>

                  <p className="mt-2 text-2xl font-bold text-green-600">
                    10
                  </p>
                </div>

                <div className="rounded-lg bg-yellow-50 p-4">
                  <p className="text-sm text-slate-500">
                    Pending
                  </p>

                  <p className="mt-2 text-2xl font-bold text-yellow-600">
                    5
                  </p>
                </div>

                <div className="rounded-lg bg-purple-50 p-4">
                  <p className="text-sm text-slate-500">
                    In Transit
                  </p>

                  <p className="mt-2 text-2xl font-bold text-purple-600">
                    8
                  </p>
                </div>

              </div>

              <div className="mt-5 rounded-lg border border-slate-200 p-4">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      SC-10024
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Mumbai → Dubai
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    In Transit
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* About */}
      <section
        id="about"
        className="bg-slate-50 py-20"
      >

        <div className="mx-auto max-w-7xl px-6">

          <div className="max-w-3xl">

            <p className="font-medium text-blue-600">
              ABOUT THE PLATFORM
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              One platform for your export operations
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Smart Cargo Export & Logistics Management System provides
              businesses with a centralized platform for managing cargo,
              shipments, logistics providers, export documents, payments,
              and shipment tracking.
            </p>

          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            <div className="rounded-xl bg-white p-6 shadow-sm">

              <div className="text-3xl">
                📦
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                Cargo Management
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Manage products, quantities, weights, packages, dimensions,
                and declared values.
              </p>

            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">

              <div className="text-3xl">
                🚚
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                Shipment Management
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create shipments and manage origin, destination, transport
                methods, and logistics providers.
              </p>

            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">

              <div className="text-3xl">
                📍
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                Shipment Tracking
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Track shipments using their unique tracking number and
                monitor delivery progress.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Services */}
      <section
        id="services"
        className="bg-white py-20"
      >

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-medium text-blue-600">
              SERVICES
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Everything you need to manage exports
            </h2>

          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {[
              {
                icon: '💰',
                title: 'Cost Estimation',
                text: 'Estimate shipping costs based on cargo and transport details.',
              },
              {
                icon: '📄',
                title: 'Documents',
                text: 'Upload and manage important export documents.',
              },
              {
                icon: '💳',
                title: 'Payments',
                text: 'Manage shipment payments and transaction records.',
              },
              {
                icon: '📊',
                title: 'Reports',
                text: 'View shipment summaries and logistics activity.',
              },
            ].map((service) => (

              <div
                key={service.title}
                className="rounded-xl border border-slate-200 p-6 hover:shadow-md"
              >

                <div className="text-3xl">
                  {service.icon}
                </div>

                <h3 className="mt-4 font-semibold text-slate-800">
                  {service.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {service.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="bg-slate-50 py-20"
      >

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-medium text-blue-600">
              HOW IT WORKS
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Manage your shipment in four steps
            </h2>

          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-4">

            {[
              ['01', 'Create Account', 'Register your business and create your profile.'],
              ['02', 'Create Shipment', 'Enter cargo, pickup, destination, and transport details.'],
              ['03', 'Manage & Pay', 'Select a logistics provider, manage documents, and make payment.'],
              ['04', 'Track Shipment', 'Use your tracking number to monitor shipment progress.'],
            ].map(([number, title, text]) => (

              <div
                key={number}
                className="text-center"
              >

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  {number}
                </div>

                <h3 className="mt-5 font-semibold text-slate-800">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Contact */}
      <section
        id="contact"
        className="bg-white py-20"
      >

        <div className="mx-auto max-w-4xl px-6 text-center">

          <p className="font-medium text-blue-600">
            GET STARTED
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            Ready to simplify your cargo management?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-500">
            Create your business account and start managing shipments,
            documents, payments, and tracking from one platform.
          </p>

          <button
            onClick={onRegister}
            className="mt-8 rounded-lg bg-blue-600 px-7 py-3 font-medium text-white hover:bg-blue-700"
          >
            Create Your Account
          </button>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 py-8">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 md:flex-row md:items-center">

          <div>

            <p className="font-semibold text-white">
              Smart Cargo Export & Logistics
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Smart management for modern cargo exports.
            </p>

          </div>

          <p className="text-sm text-slate-400">
            © 2026 Smart Cargo. Academic Project.
          </p>

        </div>

      </footer>

    </div>
  )
}

export default Home