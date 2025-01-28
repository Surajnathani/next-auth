import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    password: { type: String, select: false },
    authId: { type: String },
});

const User = mongoose.models?.User || model("User", userSchema);

export default User;