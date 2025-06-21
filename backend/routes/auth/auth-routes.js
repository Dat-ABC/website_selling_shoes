import express from 'express';
import { loginUser, registerUser, logoutUser, authMiddleware } from '../../controllers/auth/auth-controller.js';

const router = express.Router();

// Register route
router.post('/register', registerUser);
// Login route
router.post('/login', loginUser);
// Logout route
router.post('/logout', logoutUser);
// check auth middleware
router.get('/check-auth', authMiddleware, (req, res) => {
    res.status(200).json(
        {
            success: true,
            message: "Người dùng đã xác thực",
            user: req.user
        }
    );
});



export default router;