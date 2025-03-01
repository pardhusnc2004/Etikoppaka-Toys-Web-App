import bcrypt from 'bcryptjs'
import UserModel from '../Models/user.model.js'
import { GenerateToken } from '../Config/generate.token.js'
  
export const Login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userNameExists = await UserModel.findOne({ username: username });
        if(!userNameExists) {
            return res.status(400).json({ message: "Invalid credentials..." })
        }
        const validPassword = await bcrypt.compare(password, userNameExists.password);
        if(!validPassword) {
            return res.status(400).json({ message: "Invalid credentials..." })
        }
        const payload = { username: userNameExists.username, id: userNameExists._id };
        const token = await GenerateToken(payload, res);

        res.cookie("jwt_secret", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ message: "Login successful..." })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// export const Register = async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const userNameExists = await UserModel.findOne({ username: username });
//         if(userNameExists) {
//             return res.status(400).json({ message: "Invalid credentials..." })
//         }
//         const salt = await bcrypt.genSalt(10)
//         const hashedPassword = await bcrypt.hash(password, salt);
//         const newUser = new UserModel({
//             username: username,
//             password: hashedPassword
//         })
//         await newUser.save();
//         return res.status(200).json({ message: "Registration successful..." })
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }

export const Logout = async (req, res) => {
    try {
        res.clearCookie("jwt_secret", { httpOnly: true, secure: true, sameSite: "None" });
        return res.status(200).json({ message: "Logout successful..." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
