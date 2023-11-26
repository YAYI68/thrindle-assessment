import { TransactionModel } from "../models/transactionModel.js";
import CustomError from "../utils/error/CustomError.js";
import { tryCatch } from "../utils/helpers/tryCatch.js";
import { transactionSchema } from "../validators/transactionValidators.js";

export const makeTranfer = tryCatch(async (req, res) => {
  const { email, amount } = transactionSchema.parse(req.body);
  const user = req.user;

  const params = JSON.stringify({
    email: email,
    amount: amount * 100,
    channels: ["bank_transfer"],
    // callback_url: `${process.env.BASE_URL}/api/v1/`,
  });
  const response = await fetch(
    `https://api.paystack.co/transaction/initialize`,
    {
      method: "POST",
      body: params,
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // where you place your secret key copied from your dashboard
        "Content-Type": "application/json",
        credentials: "include",
      },
    }
  );

  const result = await response.json();
  if (!result.status) {
    throw new CustomError("Transaction failed", 400);
  }
  const { data } = result;
  const transaction = await TransactionModel.create({
    user: user.userId,
    amount,
    reference: data.reference,
    currency: "NGN",
  });

  res.status(200).json({ status: true, data });
});

export const verifyTransfer = tryCatch(async (req, res) => {
  const params = req.params;
  const { reference } = params;
  //   console.log({ params, reference });
  if (!reference) {
    throw new CustomError("Invalid Transaction Id", 400);
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // where you place your secret key copied from your dashboard
        "Content-Type": "application/json",
        credentials: "include",
      },
    }
  );

  if (response.status !== 200) {
    throw new CustomError("Transaction Failed", 400);
  }
  const { data } = await response.json();
  if (data.status !== "success") {
    const transaction = await TransactionModel.updateOne(
      { reference: reference },
      {
        status: "cancel",
      }
    );
    throw new CustomError("Transaction Failed", 400);
  } else {
    const transaction = await TransactionModel.updateOne(
      { reference: reference },
      {
        status: "success",
      }
    );

    return res.status(200).json({ data: transaction });
  }
});

export const allTransactions = tryCatch(async (req, res) => {
  const { status } = req.query;
  const user = req.user;
  if (!status) {
    const transactions = await TransactionModel.find({ user: user.userId });
    return res.status(200).json({ data: transactions });
  }
  const transactions = await TransactionModel.find({
    user: user.userId,
    status: status,
  });
  return res.status(200).json({ data: transactions });
});
