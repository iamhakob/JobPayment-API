const { getBestProfession, getBestClients } = require('../services/admin');

module.exports = {
  getBestProfession: async (req, res) => {
    const { start, end } = req.query;

    const bestProfession = await getBestProfession(start, end);

    res.json(bestProfession);
  },

  getBestClients: async (req, res) => {
    const { start, end, limit } = req.query;

    const bestClients = await getBestClients(
      start,
      end,
      limit,
    );

    res.json(bestClients);
  },
};