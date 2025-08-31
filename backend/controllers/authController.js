const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/emailService');
const { getWelcomeEmailHTML } = require('../utils/emailTemplates');
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '10d',
    });
};

//@desc    Register a new user
//@route   POST /api/auth/register
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const user = await User.create({
            name,
            email,
            password,
        });
        if (user) {
            try {
                const message = getWelcomeEmailHTML(user.name);

                await sendEmail({
                    to: user.email,
                    subject: 'Welcome to Rely Tailors!',
                    html: message,
                });
            } catch (emailError) {
                console.error('Email could not be sent:', emailError);
                //For now, We don't stop the registration process if the email fails
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

//@desc    Authenticate a user & get token
//@route   POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { registerUser, loginUser };