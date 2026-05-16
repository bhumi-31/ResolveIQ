const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        //joins ticket room
        socket.on('join:ticket', ({ticketId}) => {
            socket.join(`ticket:${ticketId}`);
            console.log(`User joined ticket room: ${ticketId}`);
        });

        //leave ticket room
        socket.on('leave:ticket', ({ticketId}) => {
            socket.leave(`ticket:${ticketId}`);
        });

        //disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

module.exports = {socketHandler};