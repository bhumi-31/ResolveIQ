const cron = require('node-cron');
const pool = require('../config/db');

const startSLACron = (io) => {
    cron.schedule('*/15 * * * *', async() => {
        const breached = await pool.query(
            `SELECT * FROM tickets
            WHERE status NOT IN ('resolved', 'closed')
            AND sla_deadline < NOW()`
        );

        breached.rows.forEach(ticket => {
            console.log(`SLA breached for ticket: ${ticket.id}`);
            io.emit('sla:warning', { ticketId: ticket.id, title: ticket.title });
        });

    })
}

module.exports = { startSLACron };