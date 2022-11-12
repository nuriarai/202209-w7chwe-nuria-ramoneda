import type { Response } from "express";
import CustomError from "../../CustomError/CustomError";
import { generalError } from "./error";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Given the generalError middleware", () => {
  describe("When it receives a CustomError with public message 'Database error: duplicate key' and status code 500 ", () => {
    test("Then it should invoke the status and json method's of received response with the supplied data", () => {
      const message = "text error";
      const statusCode = 500;
      const publicMessage = "Database error: duplicate key";

      const duplicateKeyError = new CustomError(
        message,
        statusCode,
        publicMessage
      );

      generalError(duplicateKeyError, null, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith({ error: publicMessage });
    });
  });
});
