import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    password: { type: String, minLength: 8, select: false },
    refreshToken: {
      type: String,
    },
  },
  {
    virtuals: {
      id: {
        get() {
          return this._id;
        },
      },
    },
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", UserSchema);
