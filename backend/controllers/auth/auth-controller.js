import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';



// register
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email đã được sử dụng" });
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save user to the database
        await newUser.save();
        res.status(201).json({ success: true, message: "Bạn đã đăng ký thành công" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Tài khoản không tồn tại" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Mật khẩu không đúng" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role, email: user.email, userName: user.username, }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '1h' });
        // Set token in cookies or session
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 3600000 // 1 hour
        });
        res.status(200).json({ success: true, message: "Đăng nhập thành công", user: { id: user._id, email: user.email, role: user.role, userName: user.username } });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// logout
const logoutUser = (req, res) => {
    try {
        // Clear the token
        res.clearCookie('token').json(
            { success: true, message: "Đăng xuất thành công" }
        );

    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// auth middleware
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Người dùng trái phép" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        // console.error("Authentication error:", error);
        res.status(401).json({ success: false, message: "Người dùng trái phép" });
    }
};


export {
    registerUser,
    loginUser,
    logoutUser,
    authMiddleware
};