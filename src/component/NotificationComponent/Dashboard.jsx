import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationDashboard from './components/NotificationDashboard';
import NotificationBell from './components/NotificationBell';
import ToastContainer from './components/ToastContainer';

// Example Dashboard component for demonstration
const Dashboard = () => (
  <div className="max-w-4xl mx-auto p-6">
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
      <p className="text-gray-600 mb-6">Welcome to your doctor appointment system dashboard.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Upcoming Appointments</h3>
          <p className="text-blue-700 text-sm">View and manage your scheduled appointments</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">Medical Records</h3>
          <p className="text-green-700 text-sm">Access your medical history and reports</p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-2">Prescriptions</h3>
          <p className="text-purple-700 text-sm">Manage your current prescriptions</p>
        </div>
      </div>
      
      <div className="mt-8">
        <Link 
          to="/notifications" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          View All Notifications
        </Link>
      </div>
    </div>
  </div>
);

function App() {
  // Get this from your authentication context/state management
  const userEmail = "user@example.com"; 

  return (
    <NotificationProvider userEmail={userEmail}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          {/* Header with notification bell */}
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-8">
                  <Link to="/" className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                    Doctor Appointment System
                  </Link>
                  <nav className="hidden md:flex space-x-6">
                    <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">Dashboard</Link>
                    <Link to="/appointments" className="text-gray-600 hover:text-gray-900 transition-colors">Appointments</Link>
                    <Link to="/notifications" className="text-gray-600 hover:text-gray-900 transition-colors">Notifications</Link>
                  </nav>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome, {userEmail}</span>
                  <NotificationBell />
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route 
                path="/notifications" 
                element={<NotificationDashboard userEmail={userEmail} />} 
              />
              {/* Add other routes as needed */}
              <Route path="/appointments" element={<div className="p-8 text-center">Appointments page - Coming soon</div>} />
            </Routes>
          </main>

          {/* Toast notifications - positioned globally */}
          <ToastContainer />
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;
