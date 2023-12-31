const request = require('supertest');
const app = require('../src/app');
const { seed } = require('../scripts/seedDb');

describe('Admin', () => {
  describe('GET /admin/best-profession', () => {
    beforeEach(async () => {
      await seed();
    });

    it('should fail since end is sooner than start', async () => {
      const { statusCode } = await request(app)
        .get('/admin/best-profession')
        .set('profile_id', '8')
        .query({ start: '2023-07-13T07:36:40.479Z' })
        .query({ end: '2018-07-13T07:36:40.479Z' });

      expect(statusCode).toEqual(400);
    });

    it('should return null no job exists in the time range', async () => {
      const { statusCode, body } = await request(app)
        .get('/admin/best-profession')
        .set('profile_id', '8')
        .query({ start: '2000-07-13T07:36:40.479Z' })
        .query({ end: '2010-07-13T07:36:40.479Z' });

      expect(statusCode).toEqual(200);
      expect(body).toBeNull();
    });

    it('should return most earned profession in the time range', async () => {
      const { statusCode, body } = await request(app)
        .get('/admin/best-profession')
        .set('profile_id', '8')
        .query({ start: '2019-07-13T07:36:40.479Z' })
        .query({ end: '2022-07-13T07:36:40.479Z' });

      expect(statusCode).toEqual(200);
      expect(body).toEqual(
        expect.objectContaining({
          total: 2683,
          profession: 'Programmer',
        }),
      );
    });
  });

  describe('GET /admin/best-clients', () => {
    beforeEach(async () => {
      await seed();
    });

    it('should fail since end is sooner than start', async () => {
      const { statusCode } = await request(app)
        .get('/admin/best-clients')
        .set('profile_id', '8')
        .query({ start: '2023-07-13T07:36:40.479Z' })
        .query({ end: '2018-07-13T07:36:40.479Z' });

      expect(statusCode).toEqual(400);
    });

    it('should return list of clients who paid most within given time range with limit 3', async () => {
      const { statusCode, body } = await request(app)
        .get('/admin/best-clients')
        .set('profile_id', '8')
        .query({ start: '2018-07-13T07:36:40.479Z' })
        .query({ end: '2023-07-13T07:36:40.479Z' })
        .query({ limit: 3 });

      expect(statusCode).toEqual(200);
      expect(body).toHaveLength(3);
      expect(body).toContainEqual(
        expect.objectContaining({
          paid: 2020,
          fullName: 'Ash Kethcum',
          id: 4,
        }),
      );
      expect(body).toContainEqual(
        expect.objectContaining({
          paid: 442,
          fullName: 'Mr Robot',
          id: 2,
        }),
      );
      expect(body).toContainEqual(
        expect.objectContaining({
          paid: 442,
          fullName: 'Harry Potter',
          id: 1,
        }),
      );
    });

    it('should return list of clients who paid most within given time range with default limit 2', async () => {
      const { statusCode, body } = await request(app)
        .get('/admin/best-clients')
        .set('profile_id', '8')
        .query({ start: '2018-07-13T07:36:40.479Z' })
        .query({ end: '2023-07-13T07:36:40.479Z' });

      expect(statusCode).toEqual(200);
      expect(body).toHaveLength(2);
      expect(body).toContainEqual(
        expect.objectContaining({
          paid: 2020,
          fullName: 'Ash Kethcum',
          id: 4,
        }),
      );
      expect(body).toContainEqual(
        expect.objectContaining({
          paid: 442,
          fullName: 'Mr Robot',
          id: 2,
        }),
      );
    });

    it('should return empty array if no client paid in the time range', async () => {
      const { statusCode, body } = await request(app)
        .get('/admin/best-clients')
        .set('profile_id', '8')
        .query({ start: '2018-07-13T07:36:40.479Z' })
        .query({ end: '2019-07-13T07:36:40.479Z' });

      expect(statusCode).toEqual(200);
      expect(body).toHaveLength(0);
    });
  });
});
