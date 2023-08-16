const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Register a user
//@route POST /api/users/register
//@access public

const registerUser = asyncHandler(async(req, res) => {
    const {userName, email, password, role} = req.body;
    type = role.toLowerCase();
    if(type === 'admin' || type === 'teacher' || type === 'student'){
        if(!userName || !email || !password) {
            res.status(400);
            throw new Error ("All fields are mandatory");
        }
        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!emailRegex.test(email)){
            res.status(400);
            throw new Error ("Please enter a valid email");
        }
        const userAvailable = await User.findOne({email});
        if(userAvailable){
            res.status(404);
            throw new Error("User already registered")
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            userName,
            email,
            password : hashedPassword,
            role : type,
        });
        console.log(`User created ${user}`);
        if(user){
            res.status(201).json({_id : user.id, email : user.email, role : user.role});
        }else{
            res.status(400);
            throw new Error("User data is not valid");
        }
    }else{
        res.status(400);
        throw new Error ("Enter valid role of user");
    }
});


//@desc Login user
//@route POST /api/users/login
//@access public

const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    if (!email || !password){
        res.status(400);
        throw new Error ("All fields are mandatory");
    }
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!emailRegex.test(email)){
        res.status(400);
        throw new Error ("Please enter a valid email");
    }
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password))){
        const _user = {...user._doc, password: undefined};
        if(user.role === "admin"){
            const accessToken = jwt.sign(
                {
                    user: {
                        userName: user.userName,
                        email:user.email,
                        id: user.id,
                        role: user.role,
                    }
                }, 
                process.env.ACCESS_TOKEN_SECERT,
                {expiresIn:"30m"}
            );
            res.status(200).json({accessToken, _user})
        }else{
            const accessToken = {value:"no token give to the users of teacher or student"}
            res.status(200).json({accessToken, _user})
        }
    }else{
        res.status(401);
        throw new Error ("email or password is not valid");
    }
});

//@desc Admin user 
//@route GET /api/users/admin
//@access private

const adminUser = asyncHandler(async(req, res) => {
    const users = await User.find({role:{ $in: ["student", "teacher"] }});
    return res.status(200).json(users);
});


module.exports = {registerUser, loginUser, adminUser};