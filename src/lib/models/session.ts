import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    ipAddress: {
        type: String,
    },
    userAgent: {
        type: String,
    },
    lastActive: {
        type: Date,
        default: Date.now,
    },
    isRevoked: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Index for automatic expiration (TTL)
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.models?.Session || mongoose.model("Session", SessionSchema);
