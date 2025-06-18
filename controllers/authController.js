const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');
const User = require ('../models/User');

exports.registerUser = async (req, res)=>{
    const {name, email, password, role} = req.body;

    try{
        let user = await User.findOne({email});
        if (user) return res.status(400).json({message : 'User already exists'});
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword, role});
        await user.save();

        const token = jwt.sign({id:user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {id: user._id, name: user.name, email: user.email, role: user.role},
        });
    } catch(err){
        res.stauts(500).json({ message: 'Server error', error: err.message});
    }
};

exports.loginUser = async (req, res)=>{
    const { email, password} = req.body;
    try{
        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({ message: 'User not registered'});
        const isMatch = await bcrypt.compare(password, user.password);
        if(!user) return res.status(400).json({message: 'Invalid credentials'});

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '7d',});
        res.json({
            message: 'Login Successful',
            token,
            user:{id:user._id, name: user.name, email: user.email, role: user.role},
        });
    } catch (err){
        res.status(500).json({message: 'Server error', error: err.message});       
    }
};