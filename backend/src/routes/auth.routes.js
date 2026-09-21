const express = require('express');
const authRouter = express.Router();
const { body } = require('express-validator');
const authUserMiddleware = require('../middlewares/auth.middleware');
const {
    registerUser,
    loginUser,
    logoutUser,
    getMe, 
} = require('../controllers/auth.controller');

/**
 * @route POST /api/auth/register
 * @desc Register user
 * @access Public
 */
authRouter.post(
    '/register',

    [
        body('username')
            .trim()
            .notEmpty()
            .withMessage('Username is required')
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters'),

        body('email')
            .trim()
            .isEmail()
            .withMessage('Valid email is required')
            .normalizeEmail(),

        body('password')
            .trim()
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters')
    ],
    registerUser
);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
authRouter.post(
    '/login',

    [
        body('email')
            .trim()
            .isEmail()
            .withMessage('Valid email is required')
            .normalizeEmail(),

        body('password')
            .trim()
            .notEmpty()
            .withMessage('Password is required')
    ],

    loginUser
);

authRouter.post('/logout', logoutUser);

/**
 * @route POST /api/auth/get-me
 * @desc get the current logged in user
 * @access Private
 */
authRouter.get('/get-me', authUserMiddleware, getMe);

module.exports = authRouter;