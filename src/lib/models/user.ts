import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        sparse: true, // Allow null/undefined values to exist (for Google users initially)
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        // Password is now optional because Google users won't have one
    },
    image: {
        type: String,
    },
    googleId: {
        type: String,
    },
    isUsernameSet: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    status: {
        type: String,
        enum: ["active", "suspended"],
        default: "active",
    },
    lastLogin: {
        type: Date,
    },
}, { timestamps: true });

export const User = mongoose.models?.User || mongoose.model("User", UserSchema);
