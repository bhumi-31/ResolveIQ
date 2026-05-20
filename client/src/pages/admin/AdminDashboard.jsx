import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ticketsRes, agentsRes] = await Promise.all([
                    api.get('/tickets'),
                    api.get('/auth/agents')
                ]);

                setTickets(ticketsRes.data.tickets);
                setAgents(agentsRes.data.agents);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const assignTicket = async (ticketId, agentId) => {
        try {
            await api.patch(`/tickets/${ticketId}`, {
                assigned_to: agentId,
                status: 'assigned'
            });

            // update local state
            setTickets(
                tickets.map((ticket) =>
                    ticket.id === ticketId
                        ? {
                            ...ticket,
                            assigned_to: agentId,
                            status: 'assigned'
                        }
                        : ticket
                )
            );

        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
                Loading dashboard...
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
                    <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full">Admin</span>
                    <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm transition">Logout</button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                        <p className="text-gray-400 text-sm mb-1">Total</p>
                        <p className="text-2xl font-semibold">{tickets.length}</p>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                        <p className="text-gray-400 text-sm mb-1">Open</p>
                        <p className="text-2xl font-semibold text-blue-400">
                            {tickets.filter(t => t.status === 'open').length}
                        </p>
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

                <h2 className="text-lg font-medium mb-4">All Tickets</h2>

                <div className="space-y-4">
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-medium text-white">{ticket.title}</h3>
                                    <p className="text-gray-400 text-sm mt-1">{ticket.description}</p>
                                </div>
                                <span className="text-xs bg-gray-800 text-gray-400 border border-gray-700 px-2.5 py-1 rounded-full ml-4">
                                    {ticket.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="flex gap-4 text-xs mb-3 mt-2">
                                <span className="text-gray-500">#{ticket.category}</span>
                                <span className="text-gray-500">{ticket.priority}</span>
                                <span className="text-gray-500">{new Date(ticket.created_at).toLocaleDateString()}</span>
                            </div>

                            {ticket.ai_suggestion && (
                                <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3 mb-3">
                                    <p className="text-xs text-violet-400 font-medium mb-1">AI Suggestion</p>
                                    <p className="text-xs text-gray-300">{ticket.ai_suggestion}</p>
                                </div>
                            )}

                            {/* Assign to agent */}
                            <div className="flex items-center gap-3 mt-3">
                                <span className="text-xs text-gray-500">Assign to:</span>
                                <select
                                    defaultValue={ticket.assigned_to || ''}
                                    onChange={(e) => assignTicket(ticket.id, e.target.value)}
                                    className="text-xs bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-violet-500"
                                >
                                    <option value="">Select agent</option>
                                    {agents.map(agent => (
                                        <option key={agent.id} value={agent.id}>
                                            {agent.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;