import CostEstimator from './pages/CostEstimator'
import { useState } from 'react'
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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const [publicPage, setPublicPage] = useState('Home')
  const [activePage, setActivePage] = useState('Dashboard')

  const handleLogin = (role) => {
  setUserRole(role)
  setIsLoggedIn(true)
  setShowLogin(false)
}

const handleLogout = () => {
  setIsLoggedIn(false)
  setUserRole('')
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

  if (!isLoggedIn) {
    if (showLogin) {
      return (
        <Login
          onLogin={handleLogin}
          onBack={() => setShowLogin(false)}
        />
      )
    }

      if (publicPage === 'About') {
    return (
      <About
       onLogin={() => setShowLogin(true)}
     onRegister={() => setShowLogin(true)}
    onNavigate={setPublicPage}
  />
    )
  }

  if (publicPage === 'Services') {
    return (
      <Services
    onLogin={() => setShowLogin(true)}
    onRegister={() => setShowLogin(true)}
    onNavigate={setPublicPage}
/>
    )
  }

  if (publicPage === 'How It Works') {
    return (
      <HowItWorks
   onLogin={() => setShowLogin(true)}
   onRegister={() => setShowLogin(true)}
   onNavigate={setPublicPage}
/>
    )
  }

  if (publicPage === 'Contact') {
    return (
    <Contact
    onLogin={() => setShowLogin(true)}
   onRegister={() => setShowLogin(true)}
   onNavigate={setPublicPage}
/>
    )
  }
   return (
    <Home
  onLogin={() => setShowLogin(true)}
  onRegister={() => setShowLogin(true)}
  onNavigate={setPublicPage}
  />
  )

    
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">

      {/* Sidebar */}
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


      {/* Main Content */}
      <main className="ml-64 min-h-screen">

        {/* Top Bar */}
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


        {/* Page Content */}
        <section className="p-8">

          {activePage === 'Dashboard' && (
         userRole === 'Administrator'
         ? <AdminDashboard />
          : userRole === 'Logistics Provider'
          ? <ProviderDashboard />
          : <Dashboard />
)}
        {activePage === 'Users' && userRole === 'Administrator' && (
         <Users />
        )}
        {activePage === 'Businesses' && userRole === 'Administrator' && (
          <Businesses />
        )}

          {activePage === 'Cargo' && (
            <Cargo />
          )}

          {activePage === 'Shipments' && (
           userRole === 'Administrator'
           ? <AdminShipments />
           : <Shipments />
        )}
        {activePage === 'Assigned Shipments' && (
       userRole === 'Logistics Provider'
        ? <AssignedShipments />
       : null
        )}
        {activePage === 'Update Shipment Status' && (
        userRole === 'Logistics Provider'
        ? <UpdateShipmentStatus />
       : null
      )}

          {activePage === 'Cost Estimator' && <CostEstimator />}
          {activePage === 'Logistics Providers' && (
           userRole === 'Administrator'
          ? <AdminProviders />
          : <Providers />
        )}
          {activePage === 'Documents' && (
          userRole === 'Administrator'
         ? <AdminDocuments />
          : <Documents />
        )}
          {activePage === 'Payments' && (
         userRole === 'Administrator'
         ? <AdminPayments />
         : <Payments />
        )}

          {activePage === 'Invoices' && <Invoices />}

          {activePage === 'Tracking' && <Tracking />}

          {activePage === 'Reports' && <Reports />}

          {activePage === 'Notifications' && <Notifications />}

          {activePage === 'Business Profile' && <BusinessProfile />}

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


/* Dashboard */

function Dashboard() {
  return (
    <div>

      {/* Welcome */}
      <div className="bg-blue-600 text-white rounded-2xl p-6 mb-8">

        <h3 className="text-2xl font-bold mb-2">
          Welcome to Smart Cargo
        </h3>

        <p className="text-blue-100">
          Manage your cargo, shipments, documents, payments and tracking
          from one place.
        </p>

      </div>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Total Shipments"
          value="24"
          description="All shipments"
        />

        <StatCard
          title="Active Shipments"
          value="8"
          description="Currently in transit"
        />

        <StatCard
          title="Pending"
          value="5"
          description="Awaiting action"
        />

        <StatCard
          title="Completed"
          value="11"
          description="Successfully delivered"
        />

      </div>


      {/* Recent Shipments */}
      <div className="bg-white rounded-xl shadow-sm">

        <div className="p-6 border-b">

          <h3 className="text-lg font-bold">
            Recent Shipments
          </h3>

          <p className="text-sm text-slate-500">
            Overview of your latest shipments
          </p>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="text-left px-6 py-4 text-sm">
                  Tracking ID
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

              <ShipmentRow
                id="SC-10024"
                destination="Dubai, UAE"
                method="Air"
                status="In Transit"
              />

              <ShipmentRow
                id="SC-10023"
                destination="Singapore"
                method="Sea"
                status="Pending"
              />

              <ShipmentRow
                id="SC-10022"
                destination="London, UK"
                method="Air"
                status="Completed"
              />

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}


/* Statistic Card */

function StatCard({ title, value, description }) {
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


/* Shipment Row */

function ShipmentRow({ id, destination, method, status }) {
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

        <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
          {status}
        </span>

      </td>

    </tr>
  )
}


/* Temporary Page */

function SimplePage({ title, description }) {
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
