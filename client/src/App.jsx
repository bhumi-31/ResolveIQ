import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/user/UserDashboard';
import CreateTicket from './pages/user/CreateTicket';
import AgentDashboard from './pages/agent/AgentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

import TicketDetail from './pages/TicketDetail';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            {/* public route */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />


            {/* user Routes */}
            <Route path="/user/dashboard" element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            } />

            <Route path="/user/Create-ticket" element={
              <ProtectedRoute allowedRoles={['user']}>
                <CreateTicket />
              </ProtectedRoute>
            } />

            {/* agent routes */}

            <Route path="/agent/dashboard" element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AgentDashboard />
              </ProtectedRoute>
            } />

            {/* admin routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />


            <Route path="/ticket/:id" element={
              <ProtectedRoute allowedRoles={['user', 'agent', 'admin']}>
                <TicketDetail />
              </ProtectedRoute>
            } />

            {/* default redirect */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;