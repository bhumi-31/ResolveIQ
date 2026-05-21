const dotenv = require('dotenv')

//load env variables
dotenv.config()

const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const http = require('http');
const {Server} = require('socket.io');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');


//create express app
const app = express();

//add cors
app.use(cors({
    origin : process.env.CLIENT_URL,
    credentials : true
}))


// middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));

// security headers
app.use(helmet());

// request logging
app.use(morgan('dev'));


//rate limiting
const limiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 1000
});

app.use(limiter);

const authRoutes = require('./routes/auth.routes');
const { socketHandler } = require('./socket/socketHandler');
const server = http.createServer(app);


app.use('/auth', authRoutes);
//test route

app.get('/', (req, res) => {
    res.send("app is running");
})

const io = new Server(server, {
    cors : {
        origin : process.env.CLIENT_URL,
        methods: ['GET', 'POST']
    }
});

// 2. THEN setup message controller with io
const messageController = require('./controllers/message.controller');
const { getMessage, sendMessage } = messageController(io);
const messageRoutes = require('./routes/message.routes')(getMessage, sendMessage);

const ticketController = require('./controllers/ticket.controller');
const { createTicket, readTickets, readOneTicket, updateTickets, deleteTicket } = ticketController(io);
const ticketRoutes = require('./routes/ticket.routes')(createTicket, readTickets, readOneTicket, updateTickets, deleteTicket);


// 3. THEN mount routes
app.use('/tickets', ticketRoutes);
app.use('/messages', messageRoutes);

socketHandler(io);

const { startSLACron } = require('./services/sla.service');

startSLACron(io);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})