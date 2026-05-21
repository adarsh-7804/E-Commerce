const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { OAuth2Client } = require('google-auth-library')

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body

        if (!idToken) {
            return res.status(400).json({ error: 'No ID token provided' })
        }

        // Verify the ID token with Google
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload()
        const { email, name, picture, sub: googleId } = payload

        if (!email) {
            return res.status(400).json({ error: 'No email from Google' })
        }

        let user = await User.findOne({ email })

        if (user) {
            // Update googleId if not set
            if (!user.googleId) {
                user.googleId = googleId
            }

            user.isOtpVerified = true
            user.isPasswordSet = !!user.password
            user.isRoleSet = !!user.role

            await user.save()
        } else {
            // Create new user
            user = new User({
                name: name || email.split('@')[0],
                email,
                googleId,
                profilePic: picture,

                password: undefined,

                isOtpVerified: true,
                isPasswordSet: false,

                role: null,
                isRoleSet: false,

                authProvider: 'google',
            })
            await user.save()
        }

        const jwtToken = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        const safeUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            isRoleSet: user.isRoleSet,
        }

        console.log("JWT Token:", jwtToken)
        console.log("User:", user)
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            isRoleSet: user.isRoleSet,
            token: jwtToken,
            requiresRoleSelection: !user.isRoleSet,
        })
    } catch (err) {
        console.error('Google login error:', err.message)
        res.status(500).json({ error: err.message || 'Google login failed' })
    }
}