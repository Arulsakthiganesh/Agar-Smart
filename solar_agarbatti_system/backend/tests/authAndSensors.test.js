const request = require('supertest');
const app = require('../src/app');

describe('Smart Solar Agarbatti API Tests', () => {
  let authToken = '';
  let userId = '';
  let machineId = 'mch_test_001';

  test('GET /health - System status should be UP', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
  });

  test('POST /api/auth/register - Should register a new user successfully', async () => {
    const userPayload = {
      name: 'Lakshmi Devi',
      email: `lakshmi_${Date.now()}@shg.org`,
      password: 'SecurePassword123',
      phone: '+919876543210',
      shgName: 'Annai Women Self Help Group',
      location: 'Madurai, Tamil Nadu',
      language: 'ta'
    };

    const res = await request(app).post('/api/auth/register').send(userPayload);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.userId).toBeDefined();

    authToken = res.body.token;
    userId = res.body.userId;
  });

  test('POST /api/auth/login - Should log in registered user', async () => {
    const userPayload = {
      name: 'Priya Sharma',
      email: `priya_${Date.now()}@shg.org`,
      password: 'PriyaPassword123',
      phone: '+919876543211',
      shgName: 'Kriti Women SHG',
      location: 'Jaipur, Rajasthan',
      language: 'hi'
    };

    await request(app).post('/api/auth/register').send(userPayload);

    const loginRes = await request(app).post('/api/auth/login').send({
      email: userPayload.email,
      password: userPayload.password
    });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.token).toBeDefined();
  });

  test('POST /api/sensors/update - Should update sensor readings and check ranges', async () => {
    const sensorPayload = {
      machineId: machineId,
      userId: userId || 'usr_demo',
      temperature: 38.5,
      humidity: 24.2,
      batteryPercentage: 88,
      batteryVoltage: 25.4,
      solarVoltage: 34.2,
      solarWattage: 180.5,
      smokeDetected: false,
      powerSource: 'Solar',
      timestamp: Date.now()
    };

    const res = await request(app)
      .post('/api/sensors/update')
      .set('Authorization', `Bearer ${authToken}`)
      .send(sensorPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.sensorId).toBeDefined();
  });

  test('POST /api/sensors/update - High temp (62°C) should trigger temperature warning alert', async () => {
    const sensorPayload = {
      machineId: machineId,
      userId: userId || 'usr_demo',
      temperature: 62.0, // Exceeds 60°C limit
      humidity: 15.0,
      batteryPercentage: 50,
      batteryVoltage: 24.0,
      solarVoltage: 30.0,
      solarWattage: 120.0,
      smokeDetected: false,
      powerSource: 'Solar',
      timestamp: Date.now()
    };

    const res = await request(app)
      .post('/api/sensors/update')
      .set('Authorization', `Bearer ${authToken}`)
      .send(sensorPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.alertsTriggered).toBeGreaterThan(0);
  });
});
