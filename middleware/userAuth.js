const jwt = require('jsonwebtoken');

const User = require('../models/user');



const authenticate = async  ( req, res, next) => {
    try {

        const token = req.header('Authorization');
        const user = jwt.verify(token, process.env.TOKEN_KEY);
        const userRow = await User.findByPk(user.userId);

        if (userRow === null) {
            return res.status(401).json({ succcess: false , message:'User not Authenticated'});
        }
        req.user = userRow;
        next();


        
    }catch(error) {
        console.log(error)
        return res.status(404).json({message: 'Something went wrong', success: false})
    }
}

module.exports = authenticate;