import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';

const TicketDetail = () => {
    const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { user } = useAuth();
    const { socket } = useSocket();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ticketRes, messagesRes] = await Promise.all([
                    api.get(`/tickets/${id}`),
                    api.get(`/messages/${id}`)
                ]);
                setTicket(ticketRes.data.ticket);
                setMessages(messagesRes.data.messages);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        if (socket) {
            socket.emit('join:ticket', { ticketId: id });
            socket.on('message:new', (message) => {
                setMessages(prev => [...prev, message]);
            });
        }

        return () => {
            if (socket) {
                socket.emit('leave:ticket', { ticketId: id });
                socket.off('message:new');
            }
        };

    }, [id, socket]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            await api.post(`/messages/${id}`, { content: newMessage });
            setNewMessage('');
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-gray-400">Loading...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
                <h1 className="text-lg font-semibold text-violet-400">ResolveIQ</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-400 hover:text-white text-sm transition"
                >
                    ← Back
                </button>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-semibold">{ticket?.title}</h2>
                            <span className="text-xs bg-gray-800 text-gray-400 border border-gray-700 px-2.5 py-1 rounded-full">
                                {ticket?.status?.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{ticket?.description}</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs mb-1">Priority</p>
                                <p className="text-white">{ticket?.priority}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">Category</p>
                                <p className="text-white">{ticket?.category || '—'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">Ticket ID</p>
                                <p className="text-white">#{ticket?.id}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">Created</p>
                                <p className="text-white">{new Date(ticket?.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-xl border border-gray-800">
                        <div className="px-6 py-4 border-b border-gray-800">
                            <h3 className="font-medium">Messages</h3>
                        </div>

                        <div className="p-6 space-y-4 min-h-64 max-h-96 overflow-y-auto">
                            {messages.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center">No messages yet. Start the conversation.</p>
                            ) : (
                                messages.map(msg => (
                                    <div key={msg.id} className={`flex ${Number(msg.sender_id) === Number(user?.id) ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                                            Number(msg.sender_id) === Number(user?.id)
                                                ? 'bg-violet-600 text-white'
                                                : 'bg-gray-800 text-gray-200'
                                        }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <form onSubmit={sendMessage} className="px-6 py-4 border-t border-gray-800 flex gap-3">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition"
                            />
                            <button
                                type="submit"
                                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-lg text-sm transition"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-span-1">
                    <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-5">
                        <h3 className="text-sm font-medium text-violet-400 mb-3">AI Suggestion</h3>
                        <p className="text-xs text-gray-300 leading-relaxed">
                            {ticket?.ai_suggestion || 'No suggestion available'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetail;