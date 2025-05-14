// const request = require("supertest");
// const express = require("express");
// const fs = require("fs");
// const app = express();
// const path = require("path");

// jest.mock("../config/db", () => ({
//   query: jest.fn()
// }));

// jest.mock("../utils/pdfParser", () => jest.fn());
// jest.mock("../controllers/notificationController", () => ({
//   generateNotifications: jest.fn()
// }));

// const db = require("../config/db");
// const extractDatesFromPDF = require("../utils/pdfParser");
// const { generateNotifications } = require("../controllers/notificationController");
// const sowController = require("../controllers/sowController");

// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

// app.use(express.json());

// // Routes setup for testing
// app.post("/uploadSOW", upload.single("pdf"), sowController.uploadSOW);
// app.post("/uploadAddendum", upload.single("pdf"), sowController.uploadAddendum);
// app.get("/deliveryManagers", sowController.getDeliveryManagers);
// app.get("/addendums/:sowId", sowController.getAddendumsBySowId);

// // Cleanup mock uploads after each test
// afterEach(() => {
//   jest.clearAllMocks();
// });

// // ✅ uploadSOW
// describe("POST /uploadSOW", () => {
//   it("should upload SOW and respond with success", async () => {
//     extractDatesFromPDF.mockResolvedValue({
//       startDate: new Date("2025-01-01"),
//       endDate: new Date("2025-12-31"),
//     });

//     db.query
//       .mockImplementationOnce((q, p, cb) => cb(null)) // update SOW status
//       .mockImplementationOnce((q, p, cb) => cb(null, { insertId: 101 })); // insert SOW

//     const res = await request(app)
//       .post("/uploadSOW")
//       .field("projectName", "Project X")
//       .field("deliveryUnit", "DU A")
//       .field("stakeholders", "Alice,Bob")
//       .field("deliveryManager", "John Doe")
//       .attach("pdf", path.join(__dirname, "dummy.pdf")); // Add a dummy PDF in same folder

//     expect(res.statusCode).toBe(200);
//     expect(res.body.message).toMatch(/uploaded/i);
//     expect(generateNotifications).toHaveBeenCalledWith(101, expect.any(Date), expect.any(Date));
//   });

//   it("should handle missing required fields", async () => {
//     const res = await request(app).post("/uploadSOW").send({});
//     expect(res.statusCode).toBe(400);
//     expect(res.body.error).toMatch(/All fields/);
//   });
// });

// // ✅ uploadAddendum
// describe("POST /uploadAddendum", () => {
//   it("should upload addendum successfully", async () => {
//     extractDatesFromPDF.mockResolvedValue({
//       startDate: new Date("2025-03-01"),
//       endDate: new Date("2025-09-30"),
//     });

//     db.query.mockImplementation((q, p, cb) => cb(null, { insertId: 201 }));

//     const res = await request(app)
//       .post("/uploadAddendum")
//       .field("sowId", "5")
//       .field("addendumType", "Change Request")
//       .field("deliveryUnit", "DU B")
//       .field("stakeholders", "Charlie,David")
//       .field("deliveryManager", "Jane Smith")
//       .attach("pdf", path.join(__dirname, "dummy.pdf"));

//     expect(res.statusCode).toBe(200);
//     expect(res.body.message).toMatch(/Addendum uploaded/);
//   });

//   it("should return 400 for invalid addendum type", async () => {
//     const res = await request(app)
//       .post("/uploadAddendum")
//       .field("sowId", "3")
//       .field("addendumType", "InvalidType")
//       .attach("pdf", path.join(__dirname, "dummy.pdf"));

//     expect(res.statusCode).toBe(400);
//     expect(res.body.error).toMatch(/Valid addendumType/);
//   });
// });

// // ✅ getDeliveryManagers
// describe("GET /deliveryManagers", () => {
//   it("should fetch delivery managers", async () => {
//     const mockManagers = [
//       { user_id: 1, First_name: "Alice", Last_name: "Smith", role: "Delivery Manager", email: "alice@test.com", delivery_unit: "DU X" },
//     ];
//     db.query.mockImplementation((q, cb) => cb(null, mockManagers));

//     const res = await request(app).get("/deliveryManagers");
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toEqual(mockManagers);
//   });

//   it("should handle db error", async () => {
//     db.query.mockImplementation((q, cb) => cb(new Error("DB Error")));

//     const res = await request(app).get("/deliveryManagers");
//     expect(res.statusCode).toBe(500);
//   });
// });

// // ✅ getAddendumsBySowId
// describe("GET /addendums/:sowId", () => {
//   it("should fetch addendums by SOW ID", async () => {
//     const mockAddendums = [
//       {
//         addendum_id: 10,
//         sow_id: 5,
//         file_name: "doc.pdf",
//         uploaded_by: 1,
//         start_date: "2025-01-01",
//         end_date: "2025-06-30",
//         delivery_unit: "DU A",
//         stakeholders: "Alice,Bob",
//         delivery_manager: "John",
//         upload_date: "2025-05-01",
//         addendum_type: "Change Request",
//         status: "Active",
//       },
//     ];
//     db.query.mockImplementation((q, params, cb) => cb(null, mockAddendums));

//     const res = await request(app).get("/addendums/5");
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toEqual(mockAddendums);
//   });
// });
const request = require("supertest");
const path = require("path");
const fs = require("fs");
const app = require("../app");

// Mock the db module
jest.mock("../config/db", () => ({
  query: jest.fn(),
}));
const db = require("../config/db");

const sowFilePath = path.join(__dirname, "files", "test-sow.pdf");
const addendumFilePath = path.join(__dirname, "files", "test-addendum.pdf");

// Check that test files exist
if (!fs.existsSync(sowFilePath)) {
  throw new Error("Missing test file: test-sow.pdf");
}
if (!fs.existsSync(addendumFilePath)) {
  throw new Error("Missing test file: test-addendum.pdf");
}

describe("sowController", () => {
  describe("POST /uploadSOW", () => {
    it("should upload SOW and respond with success", async () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(null, { insertId: 1 });
      });

      const res = await request(app)
        .post("/uploadSOW")
        .attach("file", sowFilePath)
        .field("project_id", 1)
        .field("uploaded_by", "test_user");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "SOW uploaded successfully");
    });

    it("should handle missing required fields", async () => {
      const res = await request(app)
        .post("/uploadSOW")
        .attach("file", sowFilePath); // No project_id or uploaded_by

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("POST /uploadAddendum", () => {
    it("should upload addendum successfully", async () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(null, { insertId: 1 });
      });

      const res = await request(app)
        .post("/uploadAddendum")
        .attach("file", addendumFilePath)
        .field("sow_id", 1)
        .field("uploaded_by", "test_user");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Addendum uploaded successfully");
    });

    it("should return 400 for invalid addendum type", async () => {
      const res = await request(app)
        .post("/uploadAddendum")
        .attach("file", addendumFilePath)
        .field("sow_id", "") // Invalid ID
        .field("uploaded_by", "test_user");

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("GET /deliveryManagers", () => {
    it("should fetch delivery managers", async () => {
      const mockManagers = [
        { delivery_manager: "Alice" },
        { delivery_manager: "Bob" },
      ];

      db.query.mockImplementation((query, callback) => {
        callback(null, mockManagers);
      });

      const res = await request(app).get("/deliveryManagers");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockManagers);
    });

    it("should handle db error", async () => {
      db.query.mockImplementation((query, callback) => {
        callback(new Error("DB error"));
      });

      const res = await request(app).get("/deliveryManagers");
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("message", "Internal server error");
    });
  });

  describe("GET /addendums/:sowId", () => {
    it("should fetch addendums by SOW ID", async () => {
      const sowId = 1;
      const mockAddendums = [
        { addendum_id: 1, file_name: "add1.pdf" },
        { addendum_id: 2, file_name: "add2.pdf" },
      ];

      db.query.mockImplementation((query, values, callback) => {
        callback(null, mockAddendums);
      });

      const res = await request(app).get(`/addendums/${sowId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockAddendums);
    });
  });
});
