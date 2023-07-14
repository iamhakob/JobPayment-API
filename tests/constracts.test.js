const request = require('supertest');
const app = require('../src/app');
const { seed } = require('../scripts/seedDb');

describe('Contracts', () => {
  describe('GET /contracts/:id', () => {
    beforeEach(async () => {
      await seed();
    });

    it('should fail unauthorized', async () => {
      const { statusCode } = await request(app).get('/contracts/1');

      expect(statusCode).toEqual(401);
    });

    it('should return 404 when no contact is found', async () => {
      await request(app).get('/contracts/3').set('profile_id', '4').expect(404);
    });

    it('should return the contract with specified id when it belongs to the client', async () => {
      const { statusCode, body } = await request(app)
        .get('/contracts/7')
        .set('profile_id', '4');

      expect(statusCode).toEqual(200);
      expect(body).toMatchObject({
        id: 7,
        terms: 'bla bla bla',
        status: 'in_progress',
        ContractorId: 7,
        ClientId: 4,
      });
    });
  });

  describe('GET /contracts', () => {
    beforeEach(async () => {
      await seed();
    });

    it('should fail unauthorized', async () => {
      const { statusCode } = await request(app).get('/contracts');

      expect(statusCode).toEqual(401);
    });

    it('should return empty array when no active contracts found with profile', async () => {
      const { statusCode, body } = await request(app)
        .get('/contracts')
        .set('profile_id', '5');

      expect(statusCode).toEqual(200);
      expect(body).toHaveLength(0);
    });

    it('should return the profiles`s active contracts', async () => {
      const { statusCode, body } = await request(app)
        .get('/contracts')
        .set('profile_id', '4');

      expect(statusCode).toEqual(200);
      expect(body).toHaveLength(3);
      expect(body).toContainEqual(
        expect.objectContaining({
          id: 7,
          terms: 'bla bla bla',
          status: 'in_progress',
          ContractorId: 7,
          ClientId: 4,
        }),
      );
      expect(body).toContainEqual(
        expect.objectContaining({
          id: 8,
          terms: 'bla bla bla',
          status: 'in_progress',
          ContractorId: 6,
          ClientId: 4,
        }),
      );
      expect(body).toContainEqual(
        expect.objectContaining({
          id: 9,
          terms: 'bla bla bla',
          status: 'in_progress',
          ContractorId: 8,
          ClientId: 4,
        }),
      );
    });
  });
});
