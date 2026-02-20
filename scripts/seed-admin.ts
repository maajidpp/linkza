import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "@/lib/models/user";

// Load environment variables
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in .env.local");
    process.exit(1);
}

const seedAdmin = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        const adminEmail = "admin@bento.ai";
        const adminPassword = "password123";
        const adminName = "Bento Admin";
        const adminUsername = "admin";

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("⚠️ Admin user already exists.");

            // Ensure they have admin role
            if (existingAdmin.role !== "admin") {
                existingAdmin.role = "admin";
                await existingAdmin.save();
                console.log("✅ Updated existing user to admin role.");
            }

            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const newAdmin = await User.create({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            username: adminUsername,
            role: "admin",
            status: "active",
            isUsernameSet: true,
        });

        console.log(`✅ Admin user created successfully:
        Email: ${adminEmail}
        Password: ${adminPassword}
        `);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
