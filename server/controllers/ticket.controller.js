const pool = require('../config/db');
const { triageTicket } = require('../services/ai.service');

const createTicket = async (req, res) => {
    try {
        // 1. get fields from req.body
        const { title, description, priority } = req.body;

        // 2. get created_by from req.user
        const created_by = req.user.id;

        // 3. SLA deadline calculation
        const slaMap = { low: 72, medium: 24, high: 8, critical: 2 };
        const hours = slaMap[priority];
        const sla_deadline = new Date(Date.now() + hours * 60 * 60 * 1000);


        // 4. AI triage
        const { category, ai_suggestion } = await triageTicket(title, description);

        // 5. insert into database
        const result = await pool.query(
            `INSERT INTO tickets(title, description, priority, created_by, category, ai_suggestion, sla_deadline)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [title, description, priority, created_by, category, ai_suggestion, sla_deadline]
        );

        // 6. return created ticket
        res.status(201).json({
            message: 'Ticket created successfully',
            ticket: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const readTickets = async (req, res) => {
    try {
        let result;

        //user - created ticket
        if (req.user.role === 'user') {
            result = await pool.query(
                'SELECT * FROM tickets WHERE created_by = $1', [req.user.id]
            );
        }

        //agent -> assigned tickets
        else if (req.user.role === 'agent') {
            result = await pool.query(
                'SELECT * FROM tickets WHERE assigned_to = $1',
                [req.user.id]
            );
        }

        //admin -> all ticket
        else if (req.user.role === 'admin') {
            result = await pool.query(
                'SELECT * FROM tickets'
            );
        }

        res.status(200).json({
            tickets: result.rows
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });

    }
}


const readOneTicket = async (req, res) => {
    try {

        const { id } = req.params;

        // find ticket

        const result = await pool.query(
            'SELECT * FROM tickets WHERE id = $1',
            [id]
        );

        // ticket not found
        if (!result.rows[0]) {
            return res.status(404).json({
                message: 'Ticket not found'
            });
        }

        // success response
        res.status(200).json({
            ticket: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}



const updateTickets = async (req, res) => {
    try {
        const { id } = req.params;

        const { status, priority, assigned_to } = req.body;

        const result = await pool.query(
            `UPDATE tickets SET status = $1, priority = $2, assigned_to = $3,  updated_at = NOW() WHERE id = $4 RETURNING *`,
            [status, priority, assigned_to, id]

        );

        // log ticket history
        if (status) {
            await pool.query(
                `INSERT INTO ticket_history (ticket_id, changed_by, field, old_value, new_value)
        VALUES ($1, $2, $3, $4, $5)`,
                [id, req.user.id, 'status', 'previous', status]
            );
        }

        if (priority) {
            await pool.query(
                `INSERT INTO ticket_history (ticket_id, changed_by, field, old_value, new_value)
        VALUES ($1, $2, $3, $4, $5)`,
                [id, req.user.id, 'priority', 'previous', priority]
            );
        }

        if (assigned_to) {
            await pool.query(
                `INSERT INTO ticket_history (ticket_id, changed_by, field, old_value, new_value)
        VALUES ($1, $2, $3, $4, $5)`,
                [id, req.user.id, 'assigned_to', 'previous', assigned_to]
            );
        }

        // ticket not found
        if (!result.rows[0]) {
            return res.status(404).json({
                message: 'Ticket not found'
            });
        }

        // success response
        res.status(200).json({
            message: 'Ticket updated successfully',
            ticket: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


const deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM tickets WHERE id = $1', [id]
        );

        // ticket not found
        if (!result.rows[0]) {
            return res.status(404).json({
                message: 'Ticket not found'
            });
        }

        // success response
        res.status(200).json({
            message: 'Ticket deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = { createTicket, readTickets, readOneTicket, updateTickets, deleteTicket };