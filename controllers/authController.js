const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');
const User = require ('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

exports.registerUser = async (req, res)=>{
    const {name, email, password, role} = req.body;

    try{
        let user = await User.findOne({email});
        if (user) return res.status(400).json({message : 'User already exists'});
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationToken = crypto.randomBytes(20).toString('hex');

        user = new User({ name, email, password: hashedPassword, role, interests, emailVerificationToken: verificationToken});

        const token = jwt.sign({id:user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '7d'});

        user.tokens = [token];
        await user.save();

        await sendEmail(
            user.email,
            'EMAIL VERIFICATION- VOLUNTEER SYSTEM',
            `Your verification code is: ${verificationToken}`
        );
        
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
    const {email, password} = req.body;
    try{
        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({ message: 'User not registered'});
        const isMatch = await bcrypt.compare(password, user.password);
        if(!user) return res.status(400).json({message: 'Invalid credentials'});

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '7d',});
        res.status(201).json({
            message: 'Login Successful',
            token,
            user:{id:user._id, name: user.name, email: user.email, role: user.role},
        });
        user.tokens.push(token);
        await user.save();
    } catch (err){
        res.status(500).json({message: 'Server error', error: err.message});       
    }
};

exports.logoutUser = async (req, res)=>{
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({message: 'No token provided'});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if(!user) return res.status(404).json({message: 'User not found'});
        
        user.tokens = user.tokens.filter(t=> t!== token); // this remove tokens
        await user.save();

        res.status(200).json({message: 'Logged out successfully'});
    } catch(err){
        res.status(401).json({ message: 'Invalid token or user session'});
    }
};

exports.verifyEmail = async (req, res)=>{
    const {email, code}= req.body;

    try{
        const user = await User.findOne({email});

        if(!user) return res.status(404).json({message: 'User not found'});
        if(user.isVerified) return res.status(400).json({message: 'User already verified'});

        if(user.emailVerificationToken === code){
            user.isVerified = true;
            user.emailVerificationToken = null;
            await user.save();
            return res.status(200).json({message: 'Email verified successfully'});
        } else {
            return res.status(400).json({ message: 'Invalid verification code.'});
        }
    } catch (err){
        res.status(500).json({ message: 'Server error', error: err.message});
    }
};