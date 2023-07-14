const { balanceDeposit, balanceTransfer } = require('../services/balances');

module.exports = {
  balanceDeposit: async (req, res) => {
    const clientId = req.params.userId;
    const { deposit } = req.body;

    await balanceDeposit(clientId, deposit);

    res.json({ message: 'OK' });
  },

  balanceTransfer: async (req, res) => {
    const fromClientId = req.profile.id;
    const toClientId = req.params.userId;
    const { deposit } = req.body;

    await balanceTransfer(
      fromClientId,
      toClientId,
      deposit,
    );

    res.json({ message: 'OK' });
  },
};