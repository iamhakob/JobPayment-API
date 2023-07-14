const request = require('supertest');
const app = require('../src/app');
const { Profile, Job } = require('../src/model');
const { seed } = require('../scripts/seedDb');

describe('Balances', () => {
  describe('POST /balances/deposit/:userId', () => {
    beforeEach(async () => {
      await seed();
    });

    it('should return 404 if no client is found', async () => {
      const { statusCode } = await request(app)
        .post('/balances/deposit/100')
        .set('profile_id', '5')
        .send({ deposit: 100 });

      expect(statusCode).toEqual(404);
    });

    it('should fail unauthorized', async () => {
      const { statusCode } = await request(app).post('/balances/deposit/1');

      expect(statusCode).toEqual(401);
    });

    it('should fail increasing the balance of the client since it is more than the 25 percent', async () => {
      const { statusCode } = await request(app)
        .post('/balances/deposit/1')
        .set('profile_id', '5')
        .send({ deposit: 75 });

      expect(statusCode).toEqual(403);

      const client = await Profile.findByPk(1);
      expect(client.balance).toEqual(1150);
    });

    it('should increase clients balance by 50', async () => {
      const { statusCode } = await request(app)
        .post('/balances/deposit/1')
        .set('profile_id', '5')
        .send({ deposit: 50 });

      expect(statusCode).toEqual(200);

      const client = await Profile.findByPk(1);
      expect(client.balance).toEqual(1200);
    });
  });

  describe('POST /balances/transfer/:userId', () => {
    beforeEach(async () => {
      await seed();
    });

    it('should fail transfering when transfering to yourself', async () => {
      const { statusCode } = await request(app)
        .post('/balances/transfer/4')
        .set('profile_id', '4')
        .send({ deposit: 100 });

      expect(statusCode).toEqual(400);
    });

    it('should return 404 if no client is found', async () => {
      const { statusCode } = await request(app)
        .post('/balances/transfer/100')
        .set('profile_id', '4')
        .send({ deposit: 100 });

      expect(statusCode).toEqual(404);
    });

    it('should return 404 if profile is not client', async () => {
      const { statusCode } = await request(app)
        .post('/balances/transfer/8')
        .set('profile_id', '4')
        .send({ deposit: 100 });

      expect(statusCode).toEqual(404);
    });

    it('should fail unauthorized', async () => {
      const { statusCode } = await request(app).post('/balances/transfer/1');

      expect(statusCode).toEqual(401);
    });

    it('should fail unauthorized as client', async () => {
      const { statusCode } = await request(app)
        .post('/balances/transfer/1')
        .set('profile_id', '8');

      expect(statusCode).toEqual(401);
    });

    it('should fail transfering deposit to the client since it is more than the 25 percent', async () => {
      const { statusCode } = await request(app)
        .post('/balances/transfer/3')
        .set('profile_id', '4')
        .send({ deposit: 75 });

      expect(statusCode).toEqual(403);

      const client = await Profile.findByPk(4);
      expect(client.balance).toEqual(401);
    });

    it('should transfer int to the client since it is less than the 25 percent', async () => {
      const { statusCode } = await request(app)
        .post('/balances/transfer/3')
        .set('profile_id', '4')
        .send({ deposit: 40 });

      expect(statusCode).toEqual(200);

      const client = await Profile.findByPk(4);
      expect(client.balance).toEqual(361);
    });
  });
});
