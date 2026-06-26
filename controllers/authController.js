const User = require('../models/User');
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email or password is missing.'})
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

module.exports = { signup } 