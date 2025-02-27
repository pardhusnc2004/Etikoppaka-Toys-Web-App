import { config } from 'dotenv'
import jwt from 'jsonwebtoken'
config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

export const GenerateToken = async (payload, res) => {
    try {
        const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1d" });

        res.cookie("jwt_secret", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

    } catch (error) {
        res.status(500).json({ message: "Token generation failed", error: error.message });
    }
};