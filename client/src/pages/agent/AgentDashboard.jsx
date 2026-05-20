import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AgentDashBoard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await api.get('/tickets');
                setTickets(response.data.tickets);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };


    const updateStatus = async (ticketId, newStatus) => {
        try {
            await api.patch(`/tickets/${ticketId}`, { status: newStatus });
            // update tickets state locally after success
            setTickets(tickets.map(t =>
                t.id === ticketId ? { ...t, status: newStatus } : t
            ));
        } catch (err) {
            console.error(err);
        }
    }


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
                Loading tickets...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Navbar */}
            <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
                <h1 className="text-lg font-semibold text-violet-400">ResolveIQ</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">👋 {user?.name}</span>
                    <span className="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/30 px-2.5 py-1 rounded-full">Agent</span>
                    <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm transition">Logout</button>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                        <p className="text-gray-400 text-sm mb-1">Assigned</p>
                        <p className="text-2xl font-semibold">{tickets.length}</p>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                        <p className="text-gray-400 text-sm mb-1">In Progress</p>
                        <p className="text-2xl font-semibold text-purple-400">
                            {tickets.filter(t => t.status === 'in_progress').length}
                        </p>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                        <p className="text-gray-400 text-sm mb-1">Resolved</p>
                        <p className="text-2xl font-semibold text-green-400">
                            {tickets.filter(t => t.status === 'resolved').length}
                        </p>
                    </div>
                </div>

                <h2 className="text-lg font-medium mb-4">Assigned Tickets</h2>

                {tickets.length === 0 ? (
                    <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 text-center">
                        <p className="text-gray-400">No tickets assigned yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tickets.map(ticket => (
                            <div key={ticket.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-white">{ticket.title}</h3>
                                    <select
                                        value={ticket.status}
                                        onChange={(e) => updateStatus(ticket.id, e.target.value)}
                                        className="text-xs bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-violet-500"
                                    >
                                        <option value="assigned">Assigned</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="on_hold">On Hold</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                </div>
                                <p className="text-gray-400 text-sm mb-3">{ticket.description}</p>
                                <div className="flex gap-4 text-xs mb-3">
                                    <span className="text-gray-500">#{ticket.category}</span>
                                    <span className="text-gray-500">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                </div>
                                {ticket.ai_suggestion && (
                                    <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3">
                                        <p className="text-xs text-violet-400 font-medium mb-1">AI Suggestion</p>
                                        <p className="text-xs text-gray-300">{ticket.ai_suggestion}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AgentDashBoard;