import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
    },
    message: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 1000
    }
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
