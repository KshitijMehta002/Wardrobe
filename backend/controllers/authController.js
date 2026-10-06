const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// register user - sends OTP to email
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser && existingUser.verified) {
            return res.status(400).json({ message: 'User already exists with this email. Please login.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        if (existingUser && !existingUser.verified) {
            existingUser.name = name;
            existingUser.password = hashedPassword;
            existingUser.otp = otp;
            existingUser.otpExpires = otpExpires;
            await existingUser.save();
        } else {
            await User.create({
                name,
                email: normalizedEmail,
                password: hashedPassword,
                otp,
                otpExpires,
                verified: false
            });
        }

        const message = `
Welcome to iWardrobe, ${name}! Thank you for registering with us. We are excited to have you as part of our community.

To complete your registration, please use the following One-Time Password (OTP):
Your OTP is: ${otp}

This OTP is valid for 10 minutes.`;

        await sendEmail(normalizedEmail, 'Welcome to iWardrobe - Your OTP for Registration', message);

        res.status(200).json({
            success: true,
            requiresOtp: true,
            message: 'OTP sent to your email. Please verify to complete registration.',
            email: normalizedEmail
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// verify OTP and complete registration
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found. Please register again.' });
        }

        if (user.verified) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
                message: 'Account already verified.'
            });
        }

        if (!user.otp || user.otp !== otp.toString().trim()) {
            return res.status(400).json({ message: 'Invalid OTP code. Please check and try again.' });
        }

        if (user.otpExpires && new Date() > user.otpExpires) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new code.' });
        }

        user.verified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
            message: 'Email verified successfully!'
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ message: 'Server error verifying OTP' });
    }
};

// resend OTP
const resendOTP = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        if (user.verified) {
            return res.status(400).json({ message: 'Account is already verified. Please login.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        const message = `
Hello ${user.name},

Here is your new One-Time Password (OTP) to complete your iWardrobe registration:
Your OTP is: ${otp}

This OTP is valid for 10 minutes.`;

        await sendEmail(normalizedEmail, 'iWardrobe - Your New Verification Code', message);

        res.json({ success: true, message: 'A new OTP has been sent to your email.' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: 'Server error resending OTP' });
    }
};

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const normalizedEmail = email?.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        if (user && (await bcrypt.compare(password, user.password))) {
            if (!user.verified && user.otp) {
                return res.status(403).json({
                    message: 'Please verify your email before logging in.',
                    requiresVerification: true,
                    email: user.email
                });
            }
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'server error' });
    }
};

//get users
const getusers = async (req, res) => {
    try {
        const user = await User.find({}).select('-password');
        res.json(user);

    } catch (error) {
        res.status(500).json({ message: 'server error' });
    }
}

//update profile
const updateProfile = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (name) user.name = name;
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use by another account' });
            }
            user.email = email;
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        await user.save();
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

module.exports = { registerUser, verifyOTP, resendOTP, loginUser, getusers, updateProfile };