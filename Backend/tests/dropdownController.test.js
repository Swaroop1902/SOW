const request = require("supertest");
const express = require("express");
const db = require("../config/db");

// Mock Express app
const app = express();
app.use(express.json());

// Import controller
const dropdownController = require("../controllers/dropdownController");

// Routes for testing
app.get("/api/sow-dropdown", dropdownController.getSOWDropdown);
app.get("/api/sow-details/:id", dropdownController.getFullSOWDetails);

// Mock db.query
jest.mock("../config/db", () => ({
  query: jest.fn()
}));

describe("Dropdown Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/sow-dropdown", () => {
    it("should return a list of SOW project names", async () => {
      const mockData = [
        { sow_id: 1, project_name: "Project A" },
        { sow_id: 2, project_name: "Project B" }
      ];

      db.query.mockImplementation((query, callback) => {
        callback(null, mockData);
      });

      const response = await request(app).get("/api/sow-dropdown");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
      expect(db.query).toHaveBeenCalledWith("select sow_id,project_name from sow", expect.any(Function));
    });

    it("should return 500 on DB error", async () => {
      db.query.mockImplementation((query, callback) => {
        callback(new Error("DB error"), null);
      });

      const response = await request(app).get("/api/sow-dropdown");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to retrieve SOW list" });
    });
  });

  describe("GET /api/sow-details/:id", () => {
    it("should return full SOW details with cleaned stakeholders", async () => {
      const mockResult = [
        {
          sow_id: 1,
          project_name: "Project A",
          delivery_unit: "Unit A",
          delivery_manager: "Manager A",
          stakeholders: "user1@example.com , user2@example.com\t,user3@example.com"
        }
      ];

      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      const response = await request(app).get("/api/sow-details/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        sow_id: 1,
        project_name: "Project A",
        delivery_unit: "Unit A",
        delivery_manager: "Manager A",
        stakeholders: ["user1@example.com", "user2@example.com", "user3@example.com"]
      });
    });

    it("should return 400 for invalid SOW ID", async () => {
      const response = await request(app).get("/api/sow-details/abc");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid SOW ID" });
    });

    it("should return 404 if no SOW is found", async () => {
      db.query.mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      const response = await request(app).get("/api/sow-details/99");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "SOW not found" });
    });

    it("should return 500 on DB error", async () => {
      db.query.mockImplementation((query, params, callback) => {
        callback(new Error("DB error"), null);
      });

      const response = await request(app).get("/api/sow-details/1");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to retrieve SOW details" });
    });
  });
});
