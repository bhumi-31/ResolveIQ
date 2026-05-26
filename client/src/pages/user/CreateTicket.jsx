import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const CreateTicket = () => {
    const [title, setTitle] = useState('');
    const [description, setdescription] = useState('');
    const [priority, setPriority] = useState('medium');
    // const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('priority', priority);
            if (file) formData.append('attachment', file);

            await api.post('/tickets', { title, description, priority });
            navigate('/user/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
                <h1 className="text-lg font-semibold text-violet-400">ResolveIQ</h1>
                <button
                    onClick={() => navigate('/user/dashboard')}
                    className="text-gray-400 hover:text-white text-sm transition"
                >
                    ← Back to Dashboard
                </button>
            </nav>

            <div className="max-w-2xl mx-auto px-6 py-10">
                <h2 className="text-2xl font-semibold mb-1">Raise a Ticket</h2>
                <p className="text-gray-400 text-sm mb-8">AI will automatically categorize and prioritize your ticket</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Brief summary of your issue"
                            required
                            className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setdescription(e.target.value)}
                            placeholder="Describe your issue in detail..."
                            rows={5}
                            required
                            className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">
                            Attachment <span className="text-gray-500">(optional)</span>
                        </label>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            accept=".jpg,.jpeg,.png,.pdf,.txt,.docx"
                            className="w-full bg-gray-800 text-gray-400 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-violet-600 file:text-white"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition"
                    >
                        {loading ? 'AI is analyzing your ticket...' : 'Submit Ticket'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateTicket;