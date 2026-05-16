const pool = require('../config/db');

const messageController = (io) => {

    const getMessage = async (req, res) => {
        try {
            const { ticketId } = req.params;

            const result = await pool.query(
                'SELECT * FROM messages WHERE ticket_id = $1 ORDER BY created_at ASC',
                [ticketId]
            );

            res.status(200).json({
                messages: result.rows
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const sendMessage = async (req, res) => {
        try {
            const { ticketId } = req.params;
            const { content, is_internal } = req.body;
            const sender_id = req.user.id;

            const result = await pool.query(
                `INSERT INTO messages (ticket_id, sender_id, content, is_internal)
                VALUES ($1, $2, $3, $4) RETURNING *`,
                [ticketId, sender_id, content, is_internal || false]
            );

            const message = result.rows[0];

            io.to(`ticket:${ticketId}`).emit('message:new', message);

            res.status(201).json({
                message: 'Message sent',
                data: message
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    return { getMessage, sendMessage };
};

module.exports = messageController;