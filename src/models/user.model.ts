import { create } from "domain";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  createdAt: Date,
});

const User = mongoose.model("User", userSchema);
export default User;
