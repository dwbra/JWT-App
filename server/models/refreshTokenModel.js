import mongoose from "mongoose";
//destructure what we need from mongoose
const { Schema, model } = mongoose;

const refreshTokenSchema = new Schema({
  //https://mongoosejs.com/docs/api.html#schematype_SchemaType-required
  token: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const RefreshToken = model("RefreshToken", refreshTokenSchema, "tokens");
export default RefreshToken;
