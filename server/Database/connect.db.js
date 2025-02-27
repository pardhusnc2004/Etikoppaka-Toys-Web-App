import mongoose from "mongoose";

export const ConnectDB = async (CONNECTION_STRING_URI) => {
    try {
        await mongoose.connect(CONNECTION_STRING_URI)
            .then(() => console.log("Connected to DB..."))
            .catch(() => console.log("Error occurred connecting to DB...",error.message))
        return true;
    } catch (error) {
        console.log("Not Needed....")
    }
}