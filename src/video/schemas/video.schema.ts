import mongoose, { HydratedDocument } from "mongoose";

export const VideoSchema = new mongoose.Schema({
    owner: String,
    videoPath: String,
    thumbNailPath: String,
    /* title: String,
    content: String,
    tags: { type: Array<String>, required: true } */
})