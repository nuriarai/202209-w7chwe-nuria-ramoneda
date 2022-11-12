import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import type { RegisterData } from "../../types.js";
import User from "../../../database/models/User.js";
import CustomError from "../../../CustomError/CustomError.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email, picture } = req.body as RegisterData;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      picture,
    });

    res
      .status(201)
      .json({ user: { id: newUser._id, username, email, picture } });
  } catch (error: unknown) {
    const errorObject = error as Error;

    let message = "Something went wrong with the user creation";

    if (errorObject.message.includes("duplicate key error")) {
      message = "Database error: duplicate key";
    }

    const customError = new CustomError(errorObject.message, 500, message);

    next(customError);
  }
};
