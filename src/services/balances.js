const { Op } = require('sequelize');
const { Job, Profile, Contract } = require('../model');
const { sequelize } = require('../model');
const ApiError = require('../apiError');

const MAX_ALLOWED_PERCENTAGE = 0.25;

async function getUnpaidJobsTotal(clientId, transaction) {
  return Job.sum(
    'price',
    {
      where: {
        paid: { [Op.not]: true },
      },
      include: [
        {
          model: Contract,
          required: true,
          attributes: [],
          where: {
            status: 'in_progress',
            ClientId: clientId,
          },
        },
      ],
    },
    { transaction },
  );
}

async function getClientById(clientId, transaction) {
  return Profile.findOne(
    { where: { id: clientId } },
    { ...(transaction ? { transaction } : {}) },
  );
}

async function balanceTransfer(fromClientId, toClientId, deposit) {
  return sequelize.transaction(async (t) => {
    const [toClient, fromClient] = await Promise.all([
      getClientById(toClientId, t),
      getClientById(fromClientId, t),
    ]);

    validateDepositClients(fromClient, toClient, deposit);

    const fromClientUnpaid = (await getUnpaidJobsTotal(fromClientId, t)) || 0;
    validateDepositSize(deposit, fromClientUnpaid);

    fromClient.balance -= deposit;
    toClient.balance += deposit;

    await Promise.all([
      fromClient.save({ transaction: t }),
      toClient.save({ transaction: t }),
    ]);

    return [fromClient, toClient];
  });
}

async function balanceDeposit(clientId, deposit) {
  return sequelize.transaction(async (t) => {
    const client = await Profile.findOne(
      { where: { id: clientId } },
      { transaction: t },
    );

    if (client?.type !== 'client') {
      throw new ApiError(404, 'No such client found');
    }

    const unpaidTotal = (await getUnpaidJobsTotal(clientId, t)) || 0;
    validateDepositSize(deposit, unpaidTotal);

    client.balance += deposit;

    await client.save({ transaction: t });
    return client;
  });
}

function validateDepositClients(fromClient, toClient, deposit) {
  if (toClient?.type !== 'client' || fromClient?.type !== 'client') {
    throw new ApiError(404, 'No such client found');
  }

  if (toClient.id === fromClient.id) {
    throw new ApiError(400, 'invalid params: can\'t transfer to yourself');
  }

  if (fromClient.balance < deposit) {
    throw new ApiError(403, 'Not enough balance');
  }
}

function validateDepositSize(deposit, unpaidTotal) {
  if (deposit > unpaidTotal * MAX_ALLOWED_PERCENTAGE) {
    throw new ApiError(
      403,
      `$${deposit} is exceeds the 25 percent of total ($${unpaidTotal}) unpaid jobs`,
    );
  }
}

module.exports = {
  balanceDeposit,
  balanceTransfer,
};
