// // // const userController = require("../controllers/userController");
// // // const db = require("../config/db");
// // // const crypto = require("crypto");

// // // jest.mock("../config/db");
// // // jest.mock("crypto");

// // // describe("createUser", () => {
// // //   let req, res;

// // //   beforeEach(() => {
// // //     req = {
// // //       body: {
// // //         first_name: "Jane",
// // //         last_name: "Doe",
// // //         email: "jane@example.com",
// // //         role: "user",
// // //         delivery_unit: "DU1"
// // //       }
// // //     };

// // //     res = {
// // //       status: jest.fn().mockReturnThis(),
// // //       json: jest.fn()
// // //     };

// // //     jest.clearAllMocks();
// // //   });

// // //   it.skip("should create user and insert token successfully", async () => {
// // //     // Mock user insert
// // //     db.query.mockImplementationOnce((query, values, callback) => {
// // //       callback(null, { insertId: 123 }); // Simulate user created
// // //     });

// // //     // Mock crypto
// // //     crypto.randomBytes.mockReturnValueOnce(Buffer.from("mocktoken123"));

// // //     // Mock token insert
// // //     db.query.mockImplementationOnce((query, values, callback) => {
// // //       callback(null); // Simulate success
// // //     });

// // //     await userController.createUser(req, res);

// // //     expect(db.query).toHaveBeenCalledTimes(2);
// // //     expect(res.status).toHaveBeenCalledWith(201);
// // //     expect(res.json).toHaveBeenCalledWith({ message: "User created successfully." });
// // //   });

// // //   it("should create user and insert token successfully", (done) => {
// // //   db.query
// // //     .mockImplementationOnce((query, values, callback) => {
// // //       callback(null, { insertId: 123 });
// // //     })
// // //     .mockImplementationOnce((query, values, callback) => {
// // //       callback(null);
// // //     });

// // //   crypto.randomBytes.mockReturnValueOnce(Buffer.from("mocktoken123"));

// // //   userController.createUser(req, res).then(() => {
// // //     expect(res.status).toHaveBeenCalledWith(201);
// // //     expect(res.json).toHaveBeenCalledWith({ message: "User created successfully." });
// // //     done(); // Signal to Jest that async work is done
// // //   });
// // // });


// // //   it("should return 500 if user insert fails", async () => {
// // //     db.query.mockImplementationOnce((query, values, callback) => {
// // //       callback(new Error("DB Insert Error"));
// // //     });

// // //     await userController.createUser(req, res);

// // //     expect(db.query).toHaveBeenCalledTimes(1);
// // //     expect(res.status).toHaveBeenCalledWith(500);
// // //     expect(res.json).toHaveBeenCalledWith({ error: "Failed to create user." });
// // //   });

// // //   it("should return 500 if token insert fails", async () => {
// // //     db.query.mockImplementationOnce((query, values, callback) => {
// // //       callback(null, { insertId: 123 });
// // //     });

// // //     crypto.randomBytes.mockReturnValueOnce(Buffer.from("mocktoken123"));

// // //     db.query.mockImplementationOnce((query, values, callback) => {
// // //       callback(new Error("Token Insert Error"));
// // //     });

// // //     await userController.createUser(req, res);

// // //     expect(db.query).toHaveBeenCalledTimes(2);
// // //     expect(res.status).toHaveBeenCalledWith(500);
// // //     expect(res.json).toHaveBeenCalledWith({ error: "Failed to save reset token." });
// // //   });
// // // });
const userController = require("../controllers/userController");
const db = require("../config/db");
const crypto = require("crypto");
jest.mock("../config/db", () => ({
  query: jest.fn()
}));

jest.mock("../config/db");
jest.mock("crypto");

describe("userController.createUser", () => {
  const mockReq = {
    body: {
      first_name: "Jane",
      last_name: "Doe",
      email: "jane@example.com",
      role: "Manager",
      delivery_unit: "Unit1",
    },
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  // Mock console methods
  let consoleLogMock, consoleErrorMock, consoleWarnMock, consoleInfoMock;

  beforeAll(() => {
    consoleLogMock = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
    consoleWarnMock = jest.spyOn(console, "warn").mockImplementation(() => {});
    consoleInfoMock = jest.spyOn(console, "info").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleLogMock.mockRestore();
    consoleErrorMock.mockRestore();
    consoleWarnMock.mockRestore();
    consoleInfoMock.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create user and insert password reset token", async () => {
    crypto.randomBytes.mockReturnValueOnce(Buffer.from("mocktoken1234567890"));

    db.query
      .mockImplementationOnce((query, values, callback) => {
        callback(null, { insertId: 1 });
      })
      .mockImplementationOnce((query, values, callback) => {
        callback(null);
      });

    await userController.createUser(mockReq, mockRes);

    expect(db.query).toHaveBeenCalledTimes(2);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "User created successfully.",
    });
  });

  it("should handle error during user insertion", async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(new Error("Insert user error"));
    });

    await userController.createUser(mockReq, mockRes);

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Failed to create user.",
    });
    expect(console.error).toHaveBeenCalledWith(
      "Error creating user:",
      expect.any(Error)
    );
  });

  it("should handle error during token insertion", async () => {
    crypto.randomBytes.mockReturnValueOnce(Buffer.from("mocktoken1234567890"));

    db.query
      .mockImplementationOnce((query, values, callback) => {
        callback(null, { insertId: 1 });
      })
      .mockImplementationOnce((query, values, callback) => {
        callback(new Error("Token insert error"));
      });

    await userController.createUser(mockReq, mockRes);

    expect(db.query).toHaveBeenCalledTimes(2);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Failed to save reset token.",
    });
    expect(console.error).toHaveBeenCalledWith(
      "Error saving token:",
      expect.any(Error)
    );
  });
});
