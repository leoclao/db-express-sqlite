import { Request, Response, NextFunction } from "express";
import { createContact } from "../src/controllers/contactController";
import * as contactModel from "../src/models/contactModel";

describe("createContact controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {
        name: "John Doe",
        email: "john@example.com",
        message: "Hello!",
        createdAt: new Date().toISOString(),
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should create a contact and return 201", async () => {
    const mockContact = { id: 1, name: "John Doe", email: "john@example.com", message: "Hello!", createdAt: req.body?.createdAt };
    jest.spyOn(contactModel, "createContact").mockResolvedValue(mockContact);

    await createContact(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Contact created",
      contactId: mockContact.id,
    });
  });

  it("should return 400 if required fields are missing", async () => {
    req.body = { name: "", email: "", message: "", createdAt: "" };

    await createContact(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "name, email, message, and createdAt are required",
    });
  });

  it("should return 500 if model throws an error", async () => {
    jest
      .spyOn(contactModel, "createContact")
      .mockRejectedValue(new Error("DB error"));

    await createContact(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Internal server error",
        details: "DB error",
      })
    );
  });

  it("should return 400 if any field is missing", async () => {
    const requiredFields = ["name", "email", "message", "createdAt"];
    for (const field of requiredFields) {
      const body = {
        name: "John",
        email: "john@example.com",
        message: "Hi",
        createdAt: new Date().toISOString(),
      };
      // @ts-ignore
      delete body[field];
      req.body = body;

      await createContact(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "name, email, message, and createdAt are required",
      });
      // Reset mocks for next iteration
      (res.status as jest.Mock).mockClear();
      (res.json as jest.Mock).mockClear();
    }
  });
});