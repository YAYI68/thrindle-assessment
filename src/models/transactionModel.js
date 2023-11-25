import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
      select: false,
    },
    amount: {
      type: Number,
      require: true,
    },
    reference: {
      type: String,
    },
    status: {
      type: String,
      enum: ["success", "cancel"],
    },
    currency: {
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

export const TransactionModel = mongoose.model(
  "Transaction",
  TransactionSchema
);
