import { useState } from 'react'

function Contact({ onLogin, onRegister, onNavigate }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setSubmitted(true)

    setForm({
      name: '',
      email: '',
      subject: '',
      message: '',
    })

    setTimeout(() => {
      setSubmitted(false)
    }, 4000)
  }

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
              className="text-sm font-semibold text-blue-600"
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
            Contact Us
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            We're Here to Help
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Have a question about Smart Cargo? Send us a message and our
            support team will help you.
          </p>

        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">

          {/* Contact Information */}
          <div className="space-y-5">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Get in Touch
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                Contact Information
              </h2>

              <p className="mt-4 leading-7 text-slate-500">
                Reach out to us for questions, platform support or general
                information about Smart Cargo.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xl">
                  ✉️
                </div>

                <div>
                  <p className="text-sm text-slate-500">Email</p>

                  <p className="mt-1 font-semibold text-slate-800">
                    support@smartcargo.com
                  </p>
                </div>

              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100 text-xl">
                  📞
                </div>

                <div>
                  <p className="text-sm text-slate-500">Phone</p>

                  <p className="mt-1 font-semibold text-slate-800">
                    +91 1800 123 4567
                  </p>
                </div>

              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-xl">
                  📍
                </div>

                <div>
                  <p className="text-sm text-slate-500">Office</p>

                  <p className="mt-1 font-semibold text-slate-800">
                    Mumbai, Maharashtra, India
                  </p>
                </div>

              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-xl">
                  🕐
                </div>

                <div>
                  <p className="text-sm text-slate-500">Support Hours</p>

                  <p className="mt-1 font-semibold text-slate-800">
                    Monday – Friday
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    9:00 AM – 6:00 PM
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="rounded-xl bg-white p-7 shadow-sm lg:col-span-2">

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-slate-800">
                Send Us a Message
              </h2>

              <p className="mt-2 text-slate-500">
                Fill out the form below and we'll get back to you.
              </p>

            </div>

            {submitted && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-green-700">
                Your message has been submitted successfully. We'll get back
                to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What can we help you with?"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="7"
                  placeholder="Write your message here..."
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-7 py-3 font-medium text-white hover:bg-blue-700"
              >
                Send Message
              </button>

            </form>

          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">

          <div className="mb-10 text-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              FAQ
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              Frequently Asked Questions
            </h2>

          </div>

          <div className="space-y-4">

            <div className="rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800">
                What can I manage through Smart Cargo?
              </h3>

              <p className="mt-2 leading-7 text-slate-500">
                You can manage cargo, shipments, shipping cost estimates,
                logistics providers, export documents, payments, invoices and
                shipment tracking.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800">
                Which transportation methods are supported?
              </h3>

              <p className="mt-2 leading-7 text-slate-500">
                Smart Cargo supports Air, Sea and Road transportation options
                for shipments.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800">
                Can I track my shipment?
              </h3>

              <p className="mt-2 leading-7 text-slate-500">
                Yes. Each shipment can have a unique tracking number that can
                be used to view shipment progress and status.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800">
                Who can use the platform?
              </h3>

              <p className="mt-2 leading-7 text-slate-500">
                The platform provides separate functionality for Business
                Users, Administrators and Logistics Providers.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800">
                Is the contact form connected to a backend?
              </h3>

              <p className="mt-2 leading-7 text-slate-500">
                The current frontend version uses mock client-side behavior.
                Backend integration can be added later.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 px-6 py-16 text-center text-white">

        <h2 className="text-3xl font-bold">
          Ready to Get Started?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Create your Smart Cargo account and start managing your logistics
          operations.
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

export default Contact