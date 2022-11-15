import environtment from "../../../loadEnvirontment.js";
import type { JwtPayload } from "jsonwebtoken";
import Jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import type { Credentials, RegisterData } from "../../types.js";
import User from "../../../database/models/User.js";
import CustomError from "../../../CustomError/CustomError.js";

interface UserTokenPayload extends JwtPayload {
  id: string;
  username: string;
}

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

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as Credentials;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      const error = new CustomError("User not found", 401, "Wrong credentials");
      next(error);
      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      const error = new CustomError(
        "Password incorrect",
        404,
        "Wrong credentials"
      );
      next(error);
      return;
    }

    const tokenPayload: UserTokenPayload = {
      id: user._id.toString(),
      username,
    };

    const token = Jwt.sign(tokenPayload, environtment.secret, {
      expiresIn: "2d",
    });

    res.status(200).json({ accessToken: token });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Login error"
    );

    next(customError);
  }
};
