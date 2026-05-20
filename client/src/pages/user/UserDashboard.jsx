import { useState, useEffect } from "react";
import { useAsyncError, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const UserDashBoard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/tickets')
            .then(res => setTickets(res.data.tickets))
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };


    const getStatusColor = (status) => {
        const colors = {
            open: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
            assigned: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
            in_progress: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
            on_hold: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
            resolved: 'bg-green-500/10 text-green-400 border border-green-500/30',
            closed: 'bg-gray-500/10 text-gray-400 border border-gray-500/30',
        };
        return colors[status] || colors.open;
    };


    const getPriorityColor = (priority) => {
        const colors = {
            low: 'text-gray-400',
            medium: 'text-blue-400',
            high: 'text-orange-400',
            critical: 'text-red-400',
        }

        return colors[priority] || colors.low;
    }

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-gray-400">Loading...</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-950 text-white">

            {/* Navbar */}
            <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
                <h1 className="text-lg font-semibold text-violet-400">ResolveIQ</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">👋 {user?.name}</span>
                    <button
                        onClick={() => navigate('/user/create-ticket')}
                        className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-2 rounded-lg transition"
                    >
                        + New Ticket
                    </button>
                    <button
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-white text-sm transition"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-6 py-8">

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                        <p className="text-gray-400 text-sm mb-1">Total Tickets</p>
                        <p className="text-2xl font-semibold">{tickets.length}</p>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                        <p className="text-gray-400 text-sm mb-1">Open</p>
                        <p className="text-2xl font-semibold text-blue-400">
                            {tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length}
                        </p>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                        <p className="text-gray-400 text-sm mb-1">Resolved</p>
                        <p className="text-2xl font-semibold text-green-400">
                            {tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length}
                        </p>
                    </div>
                </div>

                {/* Ticket List */}
                <h2 className="text-lg font-medium mb-4">My Tickets</h2>

                {tickets.length === 0 ? (
                    <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 text-center">
                        <p className="text-gray-400 mb-4">No tickets yet</p>
                        <button
                            onClick={() => navigate('/user/create-ticket')}
                            className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-6 py-2 rounded-lg transition"
                        >
                            Raise your first ticket
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tickets.map(ticket => (
                            <div key={ticket.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-white">{ticket.title}</h3>
                                    <span className={`text-xs px-2.5 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                                        {ticket.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-3 line-clamp-1">{ticket.description}</p>
                                <div className="flex gap-4 text-xs">
                                    <span className={getPriorityColor(ticket.priority)}>
                                        ● {ticket.priority}
                                    </span>
                                    <span className="text-gray-500">
                                        {new Date(ticket.created_at).toLocaleDateString()}
                                    </span>
                                    {ticket.category && (
                                        <span className="text-gray-500">#{ticket.category}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserDashBoard;