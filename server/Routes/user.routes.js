import { Router } from "express";
import { Login, Logout } from "../Controllers/admin.controller.js";
import { Authenticate } from "../Middlewares/admin.auth.js";

const UserRouter = Router();

// UserRouter.post('/register', Register)
UserRouter.post('/login', Login)
UserRouter.post('/logout', Authenticate, Logout)

export default UserRouter;
