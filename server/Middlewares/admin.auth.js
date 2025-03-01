import { config } from "dotenv"
config();

import jwt from 'jsonwebtoken'
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

export const Authenticate = async (req, res, next) => {
    try {
        console.log("Cookies received:", req.cookies); // extra
        console.log("Headers:", req.headers); // extra
        console.log("Cookies:", req.cookies); // extra

        const token = req.cookies["jwt_secret"];
        if(!token) {
            return res.status(403).json({ message: "Forbidden request... Login again..." })
        }
        const payload = jwt.verify(token, JWT_SECRET_KEY)
        req.admin = payload
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(500).json({ message: "Internal server error..." })
    }
}