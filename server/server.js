const dotenv = require('dotenv')
const express = require('express');
const cors = require('cors');

//load env variables
dotenv.config()

//create express app
const app = express();

//add cors
app.use(cors({
    origin : '*',
    credentials : true
}))

// middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));

//test route

app.get('/', (req, res) => {
    res.send("app is running");
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})