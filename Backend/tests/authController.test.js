const authController = require('../controllers/authController');
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../config/db');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../config/db', () => ({
  query: jest.fn()
}));
describe('authController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully and return token', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        user_id: 1,
        password: hashedPassword,
        email: 'test@example.com',
        First_name: 'John',
        Last_name: 'Doe',
        role: 'admin'
      };

      db.query.mockImplementationOnce((query, values, callback) =>
        callback(null, [mockUser])
      );

      bcrypt.compare.mockImplementationOnce((plain, hashed, cb) => cb(null, true));
      jwt.sign.mockReturnValue('mocked-jwt-token');

      authController.login(req, res);

      expect(db.query).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        token: 'mocked-jwt-token',
        userInfo: {
          name: 'John Doe',
          role: 'admin',
          email: 'test@example.com'
        }
      });
    });

    it('should return 401 for invalid email', () => {
      req.body = { email: 'wrong@example.com', password: 'password123' };
      db.query.mockImplementationOnce((query, values, callback) =>
        callback(null, [])
      );

      authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid credentials' });
    });

    it('should return 401 for incorrect password', () => {
      req.body = { email: 'test@example.com', password: 'wrongpass' };
      db.query.mockImplementationOnce((query, values, callback) =>
        callback(null, [{ user_id: 1, password: 'hashed', email: 'test@example.com', First_name: 'John', Last_name: 'Doe', role: 'admin' }])
      );

      bcrypt.compare.mockImplementationOnce((plain, hashed, cb) => cb(null, false));

      authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid credentials' });
    });

    it('should handle DB error', () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      db.query.mockImplementationOnce((query, values, callback) =>
        callback(new Error('DB Error'), null)
      );

      authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Internal server error');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token and return user info', () => {
      const decoded = { userId: 1 };
      req.headers = { authorization: 'Bearer validtoken' };

      jwt.verify.mockImplementation((token, secret, cb) => cb(null, decoded));
      db.query.mockImplementation((query, values, cb) =>
        cb(null, [{ name: 'John Doe', email: 'john@example.com', role: 'admin' }])
      );

      authController.verifyToken(req, res);

      expect(jwt.verify).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: { name: 'John Doe', email: 'john@example.com', role: 'admin' }
      });
    });

    it('should handle missing token', () => {
      req.headers = {};

      authController.verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Token missing' });
    });

    it('should handle invalid token', () => {
      req.headers = { authorization: 'Bearer invalidtoken' };
      jwt.verify.mockImplementation((token, secret, cb) => cb(new Error('Invalid token'), null));

      authController.verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid token' });
    });

    it('should handle user not found', () => {
      req.headers = { authorization: 'Bearer validtoken' };
      jwt.verify.mockImplementation((token, secret, cb) => cb(null, { userId: 99 }));
      db.query.mockImplementation((query, values, cb) => cb(null, []));

      authController.verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'User not found' });
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', () => {
      const hashedPassword = 'newhashed';
      req.body = { token: 'validtoken', password: 'newpass123' };

      db.query
        .mockImplementationOnce((query, values, cb) => cb(null, [{ user_id: 1, expires_at: new Date(Date.now() + 3600000) }])) // valid token
        .mockImplementationOnce((query, values, cb) => cb(null)) // password update
        .mockImplementationOnce((query, values, cb) => cb(null)); // delete token

      bcrypt.hash.mockImplementationOnce((password, saltRounds, cb) => cb(null, hashedPassword));

      authController.resetPassword(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Password reset successfully!' });
    });

    it('should handle expired token', () => {
      req.body = { token: 'expiredtoken', password: 'newpass' };
      db.query.mockImplementationOnce((query, values, cb) =>
        cb(null, [{ user_id: 1, expires_at: new Date(Date.now() - 3600000) }])
      );

      authController.resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Token has expired.' });
    });

    it('should handle invalid token', () => {
      req.body = { token: 'invalid', password: 'newpass' };
      db.query.mockImplementationOnce((query, values, cb) => cb(null, []));

      authController.resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token.' });
    });

    it('should handle DB error', () => {
      req.body = { token: 'token', password: 'newpass' };
      db.query.mockImplementationOnce((query, values, cb) => cb(new Error('DB error'), null));

      authController.resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
