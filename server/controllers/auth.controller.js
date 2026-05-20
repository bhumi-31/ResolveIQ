const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const registerUser = async(req, res) =>{
    try{
        // 1. get fields from req.body
        const {name, email, password, role} = req.body;

        // 2. check if user exists
        const existingUser = await pool.query(
            'SELECT * FROM users where email = $1', [email]
        );

        if(existingUser.rows.length > 0){
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // 3. hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. insert user
        const result = await pool.query(
            `INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING * `,
            [name, email, hashedPassword, role]
        );

        // 5. return user without password
        const newUser = result.rows[0];
        delete newUser.password;

        res.status(201).json({ 
            message: 'User created successfully',
            user: newUser 
        });

    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const loginUser = async(req, res) => {
    try{
        const {email, password} = req.body;

        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if(existingUser.rows.length === 0){
            return res.status(404).json({
                message : "User not found"
            });
        }

        const user = existingUser.rows[0];

        // 3. compare password
        const isMatch = await bcrypt.compare(password, user.password);

        // 4. invalid password
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // 5. generate jwt token

        const token = jwt.sign(
            {
                id : user.id,
                role : user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        // 6. remove password

        delete user.password;

        // 7. send response
        res.status(200).json({
            message: 'Login successful',
            token,
            user
        });
    }catch(error){
         res.status(500).json({
            message: error.message
        });
    }
}


const getMe = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, role, department, is_active FROM users WHERE id = $1',
            [req.user.id]
        );
        res.status(200).json({ user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { registerUser, loginUser, getMe  };