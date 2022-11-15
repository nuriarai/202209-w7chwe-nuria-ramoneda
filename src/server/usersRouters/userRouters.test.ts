import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import connectDb from "../../database";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDb(server.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

describe("Given a POST register endpoint", () => {
  describe("When it receives a request with a username 'Mireia' and a password '12345678' ", () => {
    test("Then it should respond with a 201 status code and username 'Mireia'", async () => {
      const statusExpected = 201;
      const userData = {
        username: "Mireia",
        password: "12345678",
        email: "mireia@mireia.com",
      };

      const response = await request(app)
        .post("/users/register")
        .send(userData)
        .expect(statusExpected);

      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("username", userData.username);
    });
  });

  describe("When it receives a request with a username empty", () => {
    test("Then it should respons with a 400 error and message 'Worng credentials'", async () => {
      const statusExpected = 500;
      const messageExpected = "Something went wrong with the user creation";
      const userData = {
        username: "",
        password: "12345678",
        email: "mireia@mireia.com",
      };

      const response = await request(app)
        .post("/users/register")
        .send(userData)
        .expect(statusExpected);

      expect(response.body).toHaveProperty("error", messageExpected);
    });
  });
});
