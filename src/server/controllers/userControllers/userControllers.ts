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
    console.log("abans res");
    res
      .status(201)
      .json({ user: { id: newUser._id, username, email, picture } });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Something went wrong"
    );
    next(customError);
  }
};
