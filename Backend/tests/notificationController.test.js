const moment = require("moment");

// Mocked dependencies
jest.mock("../config/db", () => ({
  query: jest.fn(),
}));

jest.mock("../utils/mailer", () => ({
  sendMail: jest.fn(),
}));

const db = require("../config/db");
const transporter = require("../utils/mailer");
const notificationController = require("../controllers/notificationController");

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe("Notification Controller", () => {
  test("getNotificationsBySOW should return notifications", () => {
    const req = { params: { sowId: "1" } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const mockResult = [{ notification_id: 1, sow_id: 1, message: "Reminder" }];

    db.query.mockImplementation((sql, params, callback) => {
      callback(null, mockResult);
    });

    notificationController.getNotificationsBySOW(req, res);

    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM notifications WHERE sow_id = ?",
      ["1"],
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  test("sendNotifications should send emails and update status", (done) => {
    const today = new Date().toISOString().split("T")[0];

    const mockNotifications = [
      {
        notification_id: 1,
        sow_id: 101,
        message: "Reminder",
        email: "test@example.com",
        project_name: "Project Test",
        end_date: "2025-06-30",
      },
    ];

    db.query.mockImplementation((sql, params, callback) => {
      if (sql.includes("SELECT")) {
        callback(null, mockNotifications);
      } else if (sql.includes("UPDATE")) {
        // callback(null, { affectedRows: 1 });
      }
    });

    transporter.sendMail.mockImplementation((mailOptions, cb) => {
      cb(null, { success: true });
    });

    // Capture console logs
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    notificationController.sendNotifications();

    // Wait a moment for async code
    setTimeout(() => {
      expect(transporter.sendMail).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE notifications SET status"),
        ["Sent", 1]
      );
      logSpy.mockRestore();
      errorSpy.mockRestore();
      done();
    }, 100); // wait for async
  });

  test("generateNotifications should insert reminders", () => {
    const sow_id = 101;
    const start_date = "2025-01-01";
    const end_date = "2025-06-30";

    db.query.mockImplementation((sql, params, callback) => {
      callback(null, { affectedRows: 5 });
    });

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    notificationController.generateNotifications(sow_id, start_date, end_date);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO notifications"),
      expect.any(Array),
      expect.any(Function)
    );

    logSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
