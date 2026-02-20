import mongoose, { Schema, Document } from 'mongoose';

export interface ITile {
    id: string;
    type: string;
    content: any;
    // Grid-based positioning
    x: number;
    y: number;
    w: number;
    h: number;
    // Optional constraints
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
    static?: boolean;
}

export interface ILayout extends Document {
    name: string;
    userId: mongoose.Schema.Types.ObjectId;
    isPublic: boolean;
    tiles: ITile[];
    createdAt: Date;
    updatedAt: Date;
}

const TileSchema = new Schema<ITile>({
    id: { type: String, required: true },
    type: { type: String, required: true },
    content: { type: Schema.Types.Mixed, required: true },
    // Grid-based positioning
    x: { type: Number, required: true, default: 0 },
    y: { type: Number, required: true, default: 0 },
    w: { type: Number, required: true, default: 2 },
    h: { type: Number, required: true, default: 1 },
    // Optional constraints
    minW: { type: Number },
    maxW: { type: Number },
    minH: { type: Number },
    maxH: { type: Number },
    static: { type: Boolean, default: false }
});

const LayoutSchema = new Schema<ILayout>(
    {
        name: { type: String, default: 'default' },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isPublic: {
            type: Boolean,
            default: true,
        },
        tiles: [TileSchema],
    },
    { timestamps: true }
);

export const Layout = mongoose.models.Layout || mongoose.model<ILayout>('Layout', LayoutSchema);
