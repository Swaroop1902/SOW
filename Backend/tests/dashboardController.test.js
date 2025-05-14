const dashboardController = require("../controllers/dashboardController");
const db = require("../config/db");

// jest.mock("../config/db");
jest.mock('../config/db', () => ({
  query: jest.fn()
}));
describe("Dashboard Controller", () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe("getDashboardForAdmin", () => {
    it("should return results successfully", () => {
      const mockResults = [{ sow_id: 1, project_name: "Project A" }];

      db.query.mockImplementationOnce((query, callback) => {
        callback(null, mockResults);
      });

      dashboardController.getDashboardForAdmin({}, res);

      expect(db.query).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockResults);
    });

    it("should handle DB error", () => {
      db.query.mockImplementationOnce((query, callback) => {
        callback(new Error("DB Error"));
      });

      dashboardController.getDashboardForAdmin({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch" });
    });
  });

  describe("getDashboardForDeliveryManager", () => {
    it("should return SOWs for valid Delivery Manager", () => {
      const req = {
        user: {
          name: "John Manager",
          role: "Delivery Manager",
          email: "john@example.com"
        }
      };

      const mockResults = [{ sow_id: 2, project_name: "Project B" }];

      db.query.mockImplementationOnce((query, values, callback) => {
        callback(null, mockResults);
      });

      dashboardController.getDashboardForDeliveryManager(req, res);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), ["John Manager"], expect.any(Function));
      expect(res.json).toHaveBeenCalledWith(mockResults);
    });

    it("should return 400 if role is invalid or name missing", () => {
      const req = {
        user: {
          role: "User",
          name: "",
          email: "john@example.com"
        }
      };

      dashboardController.getDashboardForDeliveryManager(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid request or role" });
    });

    it("should handle DB error", () => {
      const req = {
        user: {
          role: "Delivery Manager",
          name: "John Manager",
          email: "john@example.com"
        }
      };

      db.query.mockImplementationOnce((query, values, callback) => {
        callback(new Error("DB Error"));
      });

      dashboardController.getDashboardForDeliveryManager(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch" });
    });
  });

  describe("getDashboardForDeliveryHead", () => {
    it("should return SOWs for valid Delivery Head", () => {
      const req = {
        user: {
          role: "Delivery Head",
          email: "dh@example.com"
        }
      };

      const userResult = [{ delivery_unit: "DU1" }];
      const sowResults = [{ sow_id: 3, project_name: "Project C" }];

      db.query
        .mockImplementationOnce((query, values, callback) => {
          callback(null, userResult); // first query to get delivery_unit
        })
        .mockImplementationOnce((query, values, callback) => {
          callback(null, sowResults); // second query to get SOWs
        });

      dashboardController.getDashboardForDeliveryHead(req, res);

      expect(res.json).toHaveBeenCalledWith(sowResults);
    });

    it("should return 400 if email missing or role invalid", () => {
      const req = {
        user: {
          role: "User",
          email: ""
        }
      };

      dashboardController.getDashboardForDeliveryHead(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid request or role" });
    });

    it("should return 404 if Delivery Head not found", () => {
      const req = {
        user: {
          role: "Delivery Head",
          email: "unknown@example.com"
        }
      };

      db.query.mockImplementationOnce((query, values, callback) => {
        callback(null, []); // no results
      });

      dashboardController.getDashboardForDeliveryHead(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Delivery Head not found" });
    });

    it("should handle DB error in delivery unit query", () => {
      const req = {
        user: {
          role: "Delivery Head",
          email: "dh@example.com"
        }
      };

      db.query.mockImplementationOnce((query, values, callback) => {
        callback(new Error("DB Error"));
      });

      dashboardController.getDashboardForDeliveryHead(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch user" });
    });

    it("should handle DB error in SOW fetch query", () => {
      const req = {
        user: {
          role: "Delivery Head",
          email: "dh@example.com"
        }
      };

      db.query
        .mockImplementationOnce((query, values, callback) => {
          callback(null, [{ delivery_unit: "DU1" }]);
        })
        .mockImplementationOnce((query, values, callback) => {
          callback(new Error("DB Error"));
        });

      dashboardController.getDashboardForDeliveryHead(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch" });
    });
  });
});
