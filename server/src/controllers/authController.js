const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Authenticate admin user
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Missing email or password' });
        }

        // Hardcoded admin credentials
        if (email === "admin@gmail.com" && password === "admin1122") {
            return res.json({ id: "admin-fallback", email: "admin@gmail.com", role: "ADMIN", name: "Super Admin" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.name,
        });

    } catch (error) {
        console.error("Auth error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    loginAdmin
};
