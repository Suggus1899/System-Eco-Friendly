const request = require('supertest');
const app = require('../src/app');

// Mock Sequelize models
jest.mock('../src/models', () => {
  return {
    Reminder: {
      findAndCountAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn()
    },
    User: {},
    Material: {},
    Center: {},
    Schedule: {},
    Challenge: {},
    UserChallenge: {},
    Badge: {},
    UserBadge: {},
    sequelize: {
      sync: jest.fn()
    }
  };
});

const { Reminder } = require('../src/models');

// Mock auth middleware
jest.mock('../src/middleware/auth', () => ({
  authMiddleware: (req, res, next) => {
    req.user = { id: 1, role: 'user' };
    next();
  },
  isAdmin: (req, res, next) => {
    next();
  }
}));

// Mock database connection in server.js/app.js if needed?
// App.js doesn't connect. Server.js does. Supertest imports app.

describe('Reminders API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/reminders', () => {
    test('should return list of reminders', async () => {
      const mockReminders = [
        { id: 1, title: 'Test Reminder', user_id: 1, toJSON: () => ({ id: 1, title: 'Test Reminder' }) }
      ];
      
      Reminder.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: mockReminders
      });

      const res = await request(app).get('/api/reminders');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe('Test Reminder');
      expect(Reminder.findAndCountAll).toHaveBeenCalled();
    });
  });

  describe('POST /api/reminders', () => {
    test('should create a new reminder', async () => {
      const newReminder = {
        title: 'New Reminder',
        user_id: 1,
        zone: 'Norte'
      };
      
      const createdReminder = { 
        id: 1, 
        ...newReminder,
        toJSON: () => ({ id: 1, ...newReminder })
      };
      
      Reminder.create.mockResolvedValue(createdReminder);

      const res = await request(app)
        .post('/api/reminders')
        .send(newReminder);
      
      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe('New Reminder');
    });
  });
});
