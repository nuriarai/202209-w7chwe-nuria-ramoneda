import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import User from "../../../database/models/User.js";
import { loginUser, registerUser } from "./userControllers";

const req: Partial<Request> = {};
const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const next = jest.fn();

describe("Given a registerUser controller", () => {
  describe("When it receives a request with an username Maria, a password 12345 & a email maria@maria.cat", () => {
    test("Then it should be invoked it method status with a code of 201 and its method json wiht the data supplied", async () => {
      const user = {
        username: "Maria",
        password: "12345",
        email: "maria@maria.cat",
      };
      const expectedStatus = 201;

      req.body = user;
      const userId = new mongoose.Types.ObjectId();
      bcrypt.hash = jest.fn().mockResolvedValueOnce(user.password);
      User.create = jest.fn().mockResolvedValueOnce({ ...user, _id: userId });

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenLastCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({
        user: {
          username: user.username,
          email: user.email,
          id: userId,
        },
      });
    });
  });

  describe("when it receives a request with an existing user,", () => {
    test("Then it should be invoked its method status with a code of 500 and its mehod json with a message of 'Database error: duplicate key", async () => {
      const user = {
        username: "Maria",
        password: "123456",
        email: "maria@maria.cat",
      };
      const expectedStatus = 201;
      const expectedMessage = "Database error: duplicate key";
      const expectedError = new Error(expectedMessage);

      req.body = user;

      bcrypt.hash = jest.fn().mockResolvedValue(user.password);
      User.create = jest.fn().mockRejectedValue(expectedError);

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenLastCalledWith(expectedStatus);
      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a loginUser controller", () => {
  describe("When it receives a request with a username 'admin' ", () => {
    test("Then it should invoke status method with 200 code", async () => {
      const user = {
        username: "admin",
        password: "adminadmin",
      };
      req.body = user;
      const expectedStatus = 200;
      const expectedResponse = { accessToken: "token" };

      User.findOne = jest.fn().mockResolvedValue({
        username: user.username,
        password: "passwordhassed",
        _id: new mongoose.Types.ObjectId(),
      });

      bcrypt.compare = jest.fn().mockResolvedValue(true);

      Jwt.sign = jest.fn().mockReturnValue("token");

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});
