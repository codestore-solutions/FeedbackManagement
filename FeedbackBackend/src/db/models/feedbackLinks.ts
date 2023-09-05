import mongoose, { Schema, Types } from "mongoose";

interface FeedbackLinks extends Document {
    entityId: string;
    entityName: string;
    feedbackUrl: string;
    isActive: boolean;
    createdBy: string;
}

const FeedbackLinkSchema: Schema = new Schema({

    entityId: {
        type: String,
        default: "",
        required: true
    },
    entityName: {
        type: String,
        default: "",
        required: true
    },
    feedbackUrl: {
        type: String,
        default: "",
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: String,
        required: true
    },
},{ timestamps: true, versionKey: false});

export const FeedbackLinks = mongoose.model<FeedbackLinks>('FeedbackLinks', FeedbackLinkSchema);