import { error } from "console";
import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}


async function dbConnect(): Promise<void> {


    console.log("lready connected to database",process.env.MONGODB_URI)
    if (connection.isConnected) {
        console.log("already connected to database");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '',
            {}
        )
        connection.isConnected = db.connections[0].readyState
        console.log("DB connected successfully");
    } catch (errr) {
        console.log("DB connected failed", error);
        process.exit(1)
    }
}

export default dbConnect;