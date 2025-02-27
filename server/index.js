import { config } from 'dotenv';
import express from 'express'
import { ConnectDB } from './Database/connect.db.js';
config();
import cors from 'cors'
import cookieParser from 'cookie-parser';
import ItemRouter from './Routes/item.routes.js';
import UserRouter from './Routes/user.routes.js';

const app = express();
const PORT = process.env.PORT
const CONNECTION_STRING_URI = process.env.CONNECTION_STRING_URI;

// middlewares
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.use(cookieParser())


// routes
app.use('/api/v1/items', ItemRouter);
app.use('/api/v1/auth', UserRouter)

// listeners
const StartServer = async () => {
    await ConnectDB(CONNECTION_STRING_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is live on PORT: ${PORT}`)
        })
    })
}

StartServer();