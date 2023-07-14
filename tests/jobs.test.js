const request = require('supertest');
const app = require('../src/app');
const { Profile, Job } = require('../src/model');
const { seed } = require('../scripts/seedDb');

describe('Jobs', () => {
  describe('GET /jobs/unpaid', () => {
    beforeEach(async () => {
      await seed();
    });

    it('should fail unauthorized', async () => {
      const { statusCode } = await request(app).get('/jobs/unpaid');

      expect(statusCode).toEqual(401);
    });

    it('should return empty array profile does not have unpaid jobs', async () => {
      const { statusCode, body } = await request(app)
        .get('/jobs/unpaid')
        .set('profile_id', '3');

      expect(statusCode).toEqual(200);
      expect(body).toHaveLength(0);
    });

    it('should return ONLY unpaid jobs', async () => {
      const { statusCode, body } = await request(app)
        .get('/jobs/unpaid')
        .set('profile_id', '4');

      expect(statusCode).toEqual(200);
      expect(body).toHaveLength(1);
      expect(body).toContainEqual(
        expect.objectContaining({
          id: 5,
          description: 'work',
          price: 200,
          ContractId: 7,
        }),
      );
    });
  });

  describe('POST /jobs/:id/pay', () => {
    beforeEach(async () => {
      await seed();
    });

    it('should fail unauthorized', async () => {
      const { statusCode } = await request(app).post('/jobs/10000/pay');

      expect(statusCode).toEqual(401);
    });

    it('should return 404 status code when no job is found for the profile', async () => {
      const { statusCode } = await request(app)
        .post('/jobs/10000/pay')
        .set('profile_id', '1');

      expect(statusCode).toEqual(404);
    });

    it('should return 403 when job is paid', async () => {
      const { statusCode } = await request(app)
        .post('/jobs/6/pay')
        .set('profile_id', '4');

      expect(statusCode).toEqual(403);
    });

    it('should return 409 the balance is not enough', async () => {
      const { statusCode } = await request(app)
        .post('/jobs/40/pay')
        .set('profile_id', '9');

      expect(statusCode).toEqual(403);
    });

    it('should mark as paid and move balance', async () => {
      const { statusCode } = await request(app)
        .post('/jobs/5/pay')
        .set('profile_id', '4');

      expect(statusCode).toEqual(200);

      const [job, client, contractor] = await Promise.all([
        Job.findByPk(5),
        Profile.findByPk(4),
        Profile.findByPk(7),
      ]);

      expect(job.paid).toEqual(true);
      expect(client.balance).toEqual(201);
      expect(contractor.balance).toEqual(222);
    });
  });
});
