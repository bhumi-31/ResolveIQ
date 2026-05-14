const dotenv = require('dotenv')

//load env variables
dotenv.config()

const express = require('express');
const cors = require('cors');
const pool = require('./config/db');


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
app.use('/api/auth', authRoutes);

//test route

app.get('/', (req, res) => {
    res.send("app is running");
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})