const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    try{
        // 1. get authorization header
        const authHeader = req.headers.authorization;

        // 2. check token exists
        if (!authHeader) {
            return res.status(401).json({
                message: 'No token provided'
            });
        }

        // 3. extract token
        const token = authHeader.split(' ')[1];

        // 4. verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5. attach user data to request
        req.user = decoded;

         // 6. move to next middleware
        next();
    }catch(error){
        return res.status(401).json({
            message: 'Invalid token'
        });

    }
}


const restrictTo = (...roles) => {
    return(req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message: 'Access denied'
            });

        }

        next();
    }
}
module.exports = {protect, restrictTo};