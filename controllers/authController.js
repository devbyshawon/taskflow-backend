const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email or password is missing.'});
        } 

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password : hashedPassword });
        await user.save();

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt            
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Either email or password is missing.'});
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials'});
        }

        const isMatch = await bcrypt.compare(password, user.password)
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials'});
        } 

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d'});

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error'});
    }
}

module.exports = { signup, login } 