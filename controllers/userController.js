const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../models/user');

function generateAccessToken(jsonVal) {
    return jwt.sign(JSON.stringify(jsonVal), process.env.TOKEN_KEY);
}



exports.addPostUser = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const pass = req.body.password;
    const saltRounds = 10;

    try {

        const hashedPass = await bcrypt.hash(pass,saltRounds);

        const data = await User.create({
            name: name,
            email: email,
            phone: phone,
            password: hashedPass
        });

        
        res.status(201).json({message:"User created" , success: true  });
        
        
    } catch (error) {
        console.log(error);
        
        if (error.toString() === 'SequelizeUniqueConstraintError: Validation error') {
            res.status(403).json({ message: "Email already exists! Please Signup with new email"  , success: false});
            return;
        }

        return res.status(500).json({ success: false, message: "Something went wrong" });
    }



}


exports.postLoginUser = async (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;


    try {
        const data =await User.findOne({ where: { email: email } });

        if (data === null) {
            res.status(404).json({ message: "No user with this email present please Signup Or use the correct email !" , success: false});
            return;
        }

        const resBoolean = await bcrypt.compare(password, data.password)

        if (!resBoolean) {
            res.status(401).json({ message: "User not authorized" ,success:false});
            return;
        }

        res.status(200).json({data:data , message: 'user logged in succesfully' ,token: generateAccessToken(data)});
    } catch (error) {

        console.log(error);
        return res.status(503).json({ message: "Something went wrong!" , success: false});
    }

}