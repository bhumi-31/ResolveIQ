const dotenv = require('dotenv')

//load env variables
dotenv.config()

const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const http = require('http');
const {Server} = require('socket.io');


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

const authRoutes = require('./routes/auth.routes');
const ticketRoutes = require('./routes/ticket.routes');
const { socketHandler } = require('./socket/socketHandler');
const server = http.createServer(app);


app.use('/auth', authRoutes);
app.use('/tickets', ticketRoutes);
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

// 3. THEN mount routes
app.use('/messages', messageRoutes);

socketHandler(io);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})