import mongoose from "mongoose";
//destructure what we need from mongoose
const { Schema, model } = mongoose;

//create and define a new schema to use on the model
const userSchema = new Schema({
  //https://mongoosejs.com/docs/api.html#schematype_SchemaType-required
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  id: { type: String }
});

//create the model.
//pass third param to specify which collection to pass data into
//https://mongoosejs.com/docs/api.html#mongoose_Mongoose-model
const User = model("User", userSchema, "users");
export default User;
