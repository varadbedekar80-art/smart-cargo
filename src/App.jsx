import { useEffect, useState } from 'react'

import CostEstimator from './pages/CostEstimator'
import Cargo from './pages/Cargo'
import Shipments from './pages/Shipments'
import Providers from './pages/Providers'
import Documents from './pages/Documents'
import Payments from './pages/Payments'
import Invoices from './pages/Invoices'
import Tracking from './pages/Tracking'
import Notifications from './pages/Notifications'
import Reports from './pages/Reports'
import BusinessProfile from './pages/BusinessProfile'
import Settings from './pages/Settings'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import About from './pages/About'
import Services from './pages/Services'
import HowItWorks from './pages/HowItWorks'
import Contact from './pages/Contact'

import AdminDashboard from './pages/admin/AdminDashboard'
import Users from './pages/admin/Users'
import Businesses from './pages/admin/Businesses'
import AdminShipments from './pages/admin/Shipments'
import AdminDocuments from './pages/admin/Documents'
import AdminPayments from './pages/admin/Payments'
import AdminProviders from './pages/admin/Providers'
import AdminSettings from './pages/admin/Settings'

import ProviderDashboard from './pages/provider/Dashboard'
import AssignedShipments from './pages/provider/AssignedShipments'
import UpdateShipmentStatus from './pages/provider/UpdateShipmentStatus'


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('token')
  )

  const [userRole, setUserRole] = useState(() => {
    const savedUser = localStorage.getItem('user')

    if (savedUser) {
      try {
        return JSON.parse(savedUser).role || 'Business User'
      } catch {
        return 'Business User'
      }
    }

    return 'Business User'
  })

  const [showLogin, setShowLogin] = useState(false)

  const [showRegister, setShowRegister] = useState(false)

  const [publicPage, setPublicPage] = useState('Home')

  const [activePage, setActivePage] = useState('Dashboard')


  const handleLogin = (role) => {
    setUserRole(role)
    setIsLoggedIn(true)
    setShowLogin(false)
    setShowRegister(false)
    setActivePage('Dashboard')
  }


  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setIsLoggedIn(false)
    setShowLogin(false)
    setShowRegister(false)
    setUserRole('Business User')
    setActivePage('Dashboard')
  }


  const userMenuItems = [
    'Dashboard',
    'Cargo',
    'Shipments',
    'Cost Estimator',
    'Logistics Providers',
    'Documents',
    'Payments',
    'Invoices',
    'Tracking',
    'Reports',
    'Notifications',
    'Business Profile',
    'Settings',
  ]


  const adminMenuItems = [
    'Dashboard',
    'Users',
    'Businesses',
    'Shipments',
    'Documents',
    'Payments',
    'Logistics Providers',
    'Settings',
  ]


  const providerMenuItems = [
    'Dashboard',
    'Assigned Shipments',
    'Update Shipment Status',
  ]


  const menuItems =
    userRole === 'Administrator'
      ? adminMenuItems
      : userRole === 'Logistics Provider'
        ? providerMenuItems
        : userMenuItems


  /*
  ==========================================
  PUBLIC WEBSITE
  ==========================================
  */

  if (!isLoggedIn) {

    /*
    ==========================================
    LOGIN PAGE
    ==========================================
    */

    if (showLogin) {
      return (
        <Login
          onLogin={handleLogin}
          onBack={() => setShowLogin(false)}
          onRegister={() => {
            setShowLogin(false)
            setShowRegister(true)
          }}
        />
      )
    }


    /*
    ==========================================
    REGISTER PAGE
    ==========================================
    */

    if (showRegister) {
      return (
        <Register
          onBack={() => {
            setShowRegister(false)
            setShowLogin(true)
          }}
          onRegisterSuccess={() => {
            setShowRegister(false)
            setShowLogin(true)
          }}
        />
      )
    }


    /*
    ==========================================
    ABOUT
    ==========================================
    */

    if (publicPage === 'About') {
      return (
        <About
          onLogin={() => {
            setShowRegister(false)
            setShowLogin(true)
          }}
          onRegister={() => {
            setShowLogin(false)
            setShowRegister(true)
          }}
          onNavigate={setPublicPage}
        />
      )
    }


    /*
    ==========================================
    SERVICES
    ==========================================
    */

    if (publicPage === 'Services') {
      return (
        <Services
          onLogin={() => {
            setShowRegister(false)
            setShowLogin(true)
          }}
          onRegister={() => {
            setShowLogin(false)
            setShowRegister(true)
          }}
          onNavigate={setPublicPage}
        />
      )
    }


    /*
    ==========================================
    HOW IT WORKS
    ==========================================
    */

    if (publicPage === 'How It Works') {
      return (
        <HowItWorks
          onLogin={() => {
            setShowRegister(false)
            setShowLogin(true)
          }}
          onRegister={() => {
            setShowLogin(false)
            setShowRegister(true)
          }}
          onNavigate={setPublicPage}
        />
      )
    }


    /*
    ==========================================
    CONTACT
    ==========================================
    */

    if (publicPage === 'Contact') {
      return (
        <Contact
          onLogin={() => {
            setShowRegister(false)
            setShowLogin(true)
          }}
          onRegister={() => {
            setShowLogin(false)
            setShowRegister(true)
          }}
          onNavigate={setPublicPage}
        />
      )
    }


    /*
    ==========================================
    HOME
    ==========================================
    */

    return (
      <Home
        onLogin={() => {
          setShowRegister(false)
          setShowLogin(true)
        }}
        onRegister={() => {
          setShowLogin(false)
          setShowRegister(true)
        }}
        onNavigate={setPublicPage}
      />
    )
  }


  /*
  ==========================================
  LOGGED-IN APPLICATION
  ==========================================
  */

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white p-5 overflow-y-auto">

        {/* Sidebar Logo */}

        <div className="flex items-center justify-center border-b border-slate-700 pb-5 mb-5">

          <img
            src="/cargo-logo.png"
            alt="Smart Cargo"
            className="h-20 w-auto object-contain"
          />

        </div>


        <div className="mb-8">

          <h1 className="text-2xl font-bold">
            Smart Cargo
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Export & Logistics
          </p>

        </div>


        {/* Sidebar Navigation */}

        <nav className="space-y-1">

          {menuItems.map((item) => (

            <button
              key={item}
              onClick={() => setActivePage(item)}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                activePage === item
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item}
            </button>

          ))}

        </nav>

      </aside>


      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <main className="ml-64 min-h-screen">


        {/* ==========================================
            TOP BAR
        ========================================== */}

        <header className="bg-white border-b px-8 py-5 flex justify-between items-center sticky top-0 z-10">

          <div>

            <h2 className="text-2xl font-bold">
              {activePage}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Smart Cargo Export & Logistics Management System
            </p>

          </div>


          <div className="flex items-center gap-4">


            <button className="text-xl">
              🔔
            </button>


            <div className="text-right">

              <p className="font-semibold">
                {userRole}
              </p>

              <p className="text-xs text-slate-500">
                Export Company
              </p>

            </div>


            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">

              {userRole === 'Administrator'
                ? 'AD'
                : userRole === 'Logistics Provider'
                  ? 'LP'
                  : 'BU'}

            </div>


            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Logout
            </button>

          </div>

        </header>


        {/* ==========================================
            PAGE CONTENT
        ========================================== */}

        <section className="p-8">


          {/* DASHBOARD */}

          {activePage === 'Dashboard' && (

            userRole === 'Administrator'

              ? <AdminDashboard />

              : userRole === 'Logistics Provider'

                ? <ProviderDashboard />

                : <Dashboard />

          )}


          {/* ADMIN USERS */}

          {activePage === 'Users' &&
            userRole === 'Administrator' && (
              <Users />
            )}


          {/* ADMIN BUSINESSES */}

          {activePage === 'Businesses' &&
            userRole === 'Administrator' && (
              <Businesses />
            )}


          {/* CARGO */}

          {activePage === 'Cargo' && (
            <Cargo />
          )}


          {/* SHIPMENTS */}

          {activePage === 'Shipments' && (

            userRole === 'Administrator'

              ? <AdminShipments />

              : <Shipments />

          )}


          {/* PROVIDER ASSIGNED SHIPMENTS */}

          {activePage === 'Assigned Shipments' && (

            userRole === 'Logistics Provider'

              ? <AssignedShipments />

              : null

          )}


          {/* PROVIDER UPDATE STATUS */}

          {activePage === 'Update Shipment Status' && (

            userRole === 'Logistics Provider'

              ? <UpdateShipmentStatus />

              : null

          )}


          {/* COST ESTIMATOR */}

          {activePage === 'Cost Estimator' && (
            <CostEstimator />
          )}


          {/* LOGISTICS PROVIDERS */}

          {activePage === 'Logistics Providers' && (

            userRole === 'Administrator'

              ? <AdminProviders />

              : <Providers />

          )}


          {/* DOCUMENTS */}

          {activePage === 'Documents' && (

            userRole === 'Administrator'

              ? <AdminDocuments />

              : <Documents />

          )}


          {/* PAYMENTS */}

          {activePage === 'Payments' && (

            userRole === 'Administrator'

              ? <AdminPayments />

              : <Payments />

          )}


          {/* INVOICES */}

          {activePage === 'Invoices' && (
            <Invoices />
          )}


          {/* TRACKING */}

          {activePage === 'Tracking' && (
            <Tracking />
          )}


          {/* REPORTS */}

          {activePage === 'Reports' && (
            <Reports />
          )}


          {/* NOTIFICATIONS */}

          {activePage === 'Notifications' && (
            <Notifications />
          )}


          {/* BUSINESS PROFILE */}

          {activePage === 'Business Profile' && (
            <BusinessProfile />
          )}


          {/* SETTINGS */}

          {activePage === 'Settings' && (

            userRole === 'Administrator'

              ? <AdminSettings />

              : <Settings />

          )}

        </section>

      </main>

    </div>
  )
}


/*
==========================================
BUSINESS USER DASHBOARD
==========================================
*/

function Dashboard() {

  const [shipments, setShipments] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')


  /*
  ==========================================
  FETCH SHIPMENTS
  ==========================================
  */

  useEffect(() => {
    fetchDashboardData()
  }, [])


  const fetchDashboardData = async () => {

    try {

      setLoading(true)

      setError('')


      const token = localStorage.getItem('token')


      const response = await fetch(
        'https://smart-cargo.onrender.com/api/shipments',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )


      const data = await response.json()


      if (!response.ok) {

        throw new Error(
          data.message ||
          'Failed to fetch dashboard data'
        )

      }


      setShipments(data)

    } catch (error) {

      console.error(error)

      setError(error.message)

    } finally {

      setLoading(false)

    }

  }


  /*
  ==========================================
  CALCULATE STATISTICS
  ==========================================
  */

  const activeShipments = shipments.filter(
    (shipment) =>
      shipment.status === 'In Transit' ||
      shipment.status === 'Picked Up'
  ).length


  const pendingShipments = shipments.filter(
    (shipment) =>
      shipment.status === 'Pending'
  ).length


  const completedShipments = shipments.filter(
    (shipment) =>
      shipment.status === 'Completed' ||
      shipment.status === 'Delivered'
  ).length


  /*
  ==========================================
  RECENT SHIPMENTS
  ==========================================
  */

  const recentShipments = [...shipments]
    .sort(
      (a, b) =>
        new Date(b.created_at) -
        new Date(a.created_at)
    )
    .slice(0, 5)


  return (
    <div>


      {/* ==========================================
          WELCOME SECTION
      ========================================== */}

      <div className="bg-blue-600 text-white rounded-2xl p-6 mb-8">

        <h3 className="text-2xl font-bold mb-2">
          Welcome to Smart Cargo
        </h3>

        <p className="text-blue-100">
          Manage your cargo, shipments, documents, payments and tracking
          from one place.
        </p>

      </div>


      {/* ==========================================
          ERROR MESSAGE
      ========================================== */}

      {error && (

        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-red-700">

          {error}

        </div>

      )}


      {/* ==========================================
          SUMMARY CARDS
      ========================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">


        <StatCard
          title="Total Shipments"
          value={
            loading
              ? '...'
              : shipments.length
          }
          description="All shipments"
        />


        <StatCard
          title="Active Shipments"
          value={
            loading
              ? '...'
              : activeShipments
          }
          description="Currently in transit"
        />


        <StatCard
          title="Pending"
          value={
            loading
              ? '...'
              : pendingShipments
          }
          description="Awaiting action"
        />


        <StatCard
          title="Completed"
          value={
            loading
              ? '...'
              : completedShipments
          }
          description="Successfully delivered"
        />

      </div>


      {/* ==========================================
          RECENT SHIPMENTS
      ========================================== */}

      <div className="bg-white rounded-xl shadow-sm">


        <div className="p-6 border-b">

          <h3 className="text-lg font-bold">
            Recent Shipments
          </h3>

          <p className="text-sm text-slate-500">
            Overview of your latest shipments
          </p>

        </div>


        {loading ? (

          <div className="p-8 text-center text-slate-500">

            Loading shipments...

          </div>

        ) : recentShipments.length === 0 ? (

          <div className="p-8 text-center text-slate-500">

            No shipments found.

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">


              <thead className="bg-slate-50">

                <tr>

                  <th className="text-left px-6 py-4 text-sm">
                    Shipment ID
                  </th>

                  <th className="text-left px-6 py-4 text-sm">
                    Destination
                  </th>

                  <th className="text-left px-6 py-4 text-sm">
                    Method
                  </th>

                  <th className="text-left px-6 py-4 text-sm">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {recentShipments.map((shipment) => (

                  <ShipmentRow
                    key={shipment.id}
                    id={shipment.shipment_number}
                    destination={shipment.destination}
                    method={shipment.shipping_method}
                    status={shipment.status}
                  />

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  )
}


/*
==========================================
STATISTIC CARD
==========================================
*/

function StatCard({
  title,
  value,
  description
}) {

  return (

    <div className="bg-white rounded-xl p-6 shadow-sm">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h3 className="text-3xl font-bold mt-2">
        {value}
      </h3>

      <p className="text-sm text-blue-600 mt-2">
        {description}
      </p>

    </div>

  )
}


/*
==========================================
SHIPMENT ROW
==========================================
*/

function ShipmentRow({
  id,
  destination,
  method,
  status
}) {

  return (

    <tr className="border-t">

      <td className="px-6 py-4 font-medium">
        {id}
      </td>

      <td className="px-6 py-4">
        {destination}
      </td>

      <td className="px-6 py-4">
        {method}
      </td>

      <td className="px-6 py-4">

        <span
          className={`px-3 py-1 rounded-full text-xs ${
            status === 'Completed' ||
            status === 'Delivered'
              ? 'bg-green-100 text-green-700'
              : status === 'Pending'
                ? 'bg-yellow-100 text-yellow-700'
                : status === 'Cancelled'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-blue-100 text-blue-700'
          }`}
        >
          {status}
        </span>

      </td>

    </tr>

  )
}


/*
==========================================
TEMPORARY PAGE
==========================================
*/

function SimplePage({
  title,
  description
}) {

  return (

    <div className="bg-white rounded-xl p-8 shadow-sm">

      <h3 className="text-2xl font-bold mb-2">
        {title}
      </h3>

      <p className="text-slate-500">
        {description}
      </p>

      <div className="mt-8 p-6 border-2 border-dashed border-slate-200 rounded-xl text-center">

        <p className="text-slate-400">
          This page will be developed next.
        </p>

      </div>

    </div>

  )
}


export default App