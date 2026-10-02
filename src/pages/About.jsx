function About({ onLogin, onRegister, onNavigate }) {
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
            About Smart Cargo
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Simplifying Cargo Export & Logistics Management
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Smart Cargo is a centralized web-based platform designed to
            simplify cargo shipment management for businesses and logistics
            providers.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Our Platform
            </p>

            <h2 className="text-3xl font-bold text-slate-800">
              One Platform for Your Export Operations
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Smart Cargo provides businesses with a centralized platform to
              create and manage shipments, organize cargo information, estimate
              shipping costs, manage export documents, make payments, and track
              shipments.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              The system also provides logistics providers with tools to manage
              assigned shipments and update pickup, transportation, and
              delivery status.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              Administrators can monitor users, businesses, shipments,
              documents, payments, logistics providers, and platform settings
              from a centralized dashboard.
            </p>
          </div>

          {/* Platform Highlights */}
          <div className="grid gap-5 sm:grid-cols-2">

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-xl">
                📦
              </div>

              <h3 className="font-semibold text-slate-800">
                Cargo Management
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Manage cargo details, packages, weights, dimensions and
                declared values.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-xl">
                🚚
              </div>

              <h3 className="font-semibold text-slate-800">
                Shipment Management
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create shipments and manage air, sea and road transportation
                options.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-xl">
                📄
              </div>

              <h3 className="font-semibold text-slate-800">
                Export Documents
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Organize invoices, packing lists, certificates and insurance
                documents.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-xl">
                📍
              </div>

              <h3 className="font-semibold text-slate-800">
                Shipment Tracking
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Track shipments using unique shipment tracking numbers.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Our Objectives
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              Built to Make Logistics Simpler
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl border border-slate-200 p-6">
              <div className="text-3xl">01</div>

              <h3 className="mt-4 font-semibold text-slate-800">
                Centralized Management
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Keep cargo, shipment, documents, payments and tracking
                information in one platform.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-6">
              <div className="text-3xl">02</div>

              <h3 className="mt-4 font-semibold text-slate-800">
                Reduce Manual Work
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Simplify common export and logistics management activities.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-6">
              <div className="text-3xl">03</div>

              <h3 className="mt-4 font-semibold text-slate-800">
                Cost Estimation
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Estimate shipping costs based on cargo and shipment details.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-6">
              <div className="text-3xl">04</div>

              <h3 className="mt-4 font-semibold text-slate-800">
                Better Visibility
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Provide shipment tracking and status information throughout
                the logistics process.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* User Roles */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Who Uses Smart Cargo?
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              Designed for Every Role
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-xl bg-white p-7 shadow-sm">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
                👤
              </div>

              <h3 className="text-xl font-semibold text-slate-800">
                Business User
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                Manage business information, cargo, shipments, documents,
                payments, invoices and shipment tracking.
              </p>
            </div>

            <div className="rounded-xl bg-white p-7 shadow-sm">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-2xl">
                🛡️
              </div>

              <h3 className="text-xl font-semibold text-slate-800">
                Administrator
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                Monitor users, businesses, shipments, documents, payments,
                logistics providers and platform settings.
              </p>
            </div>

            <div className="rounded-xl bg-white p-7 shadow-sm">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
                🚛
              </div>

              <h3 className="text-xl font-semibold text-slate-800">
                Logistics Provider
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                Manage assigned shipments and update pickup, transportation
                and delivery status.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 px-6 py-16 text-center text-white">

        <h2 className="text-3xl font-bold">
          Ready to Simplify Your Cargo Management?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Manage shipments, documents, payments and tracking from one
          centralized platform.
        </p>

        <button
          onClick={onRegister}
          className="mt-7 rounded-lg bg-blue-600 px-7 py-3 font-medium hover:bg-blue-700"
        >
          Get Started
        </button>

      </section>

      {/* Footer */}
      <footer className="bg-slate-950 px-6 py-8 text-center text-sm text-slate-400">
        © 2026 Smart Cargo Export & Logistics Management System. All rights
        reserved.
      </footer>

    </div>
  )
}

export default About