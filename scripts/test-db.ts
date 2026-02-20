
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in .env.local");
    process.exit(1);
}

async function checkConnection() {
    console.log(`Testing connection to: ${MONGODB_URI}`);
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log("✅ Successfully connected to MongoDB!");
        console.log(`Database Name: ${mongoose.connection.name}`);
        console.log("The database has been created (or already exists).");

        // Optional: List collections
        const collections = await mongoose.connection.db?.listCollections().toArray();
        console.log("Collections:", collections?.map(c => c.name));

        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}

checkConnection();
