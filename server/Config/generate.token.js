import { config } from 'dotenv'
import jwt from 'jsonwebtoken'
config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

export const GenerateToken = async (payload, res) => {
    try {
        const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1d" });
        return token;
    } catch (error) {
        throw new Error(error.message);
    }
};