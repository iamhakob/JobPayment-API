const { Op } = require('sequelize');
const { Job, Contract, Profile, sequelize } = require('../model');
const ApiError = require('../apiError');

async function getProfileUnpaidJobs(profileId) {
  return Job.findAll({
    where: {
      paid: { [Op.not]: true },
    },
    attributes: {
      exclude: ['paid', 'paymentDate'],
    },
    include: [
      {
        model: Contract,
        required: true,
        attributes: [],
        where: {
          // assuming that active contracts mean in_progress and new contracts
          status: { [Op.ne]: 'terminated' },
          [Op.or]: [
            {
              ClientId: profileId,
            },
            {
              ContractorId: profileId,
            },
          ],
        },
      },
    ],
  });
}

async function getClientJobById(jobId, clientId, transaction) {
  return Job.findOne(
    {
      where: { id: jobId },
      include: [
        {
          model: Contract,
          where: { ClientId: clientId },
          attributes: ['ContractorId'],
          required: true,
        },
      ],
    },
    { ...(transaction ? { transaction } : {}) }
  );
}

async function payJob(jobId, clientId) {
  return sequelize.transaction(async (t) => {
    const job = await getClientJobById(jobId, clientId, t);

    validateJobDetails(job);

    const { price } = job;
    const contractorId = job.Contract.ContractorId;

    const contractorPromise = Profile.findOne(
      { where: { id: contractorId } },
      { transaction: t }
    );
    const clientPromise = Profile.findOne(
      { where: { id: clientId } },
      { transaction: t }
    );
    // creating the two promises above, then awaiting them together to make it parralel
    // if there were more than two operations we would use Promise.all to do the same
    const client = await clientPromise;
    const contractor = await contractorPromise;

    validateBalance(client, price);

    client.balance -= price;
    contractor.balance += price;
    job.paymentDate = new Date().toISOString();
    job.paid = true;

    // avoiding sequential saving with Promise.all
    await Promise.all([
      job.save({ transaction: t }),
      contractor.save({ transaction: t }),
      client.save({ transaction: t }),
    ]);

    return job;
  });
}

function validateJobDetails(job) {
  if (!job) {
    throw new ApiError(404, 'No associated job found');
  }

  if (job.paid) {
    throw new ApiError(403, 'Job is paid');
  }

  if (!job.Contract.ContractorId) {
    throw new ApiError(404, 'Contractor not found');
  }
}

function validateBalance(client, price) {
  if (client.balance < price) {
    throw new ApiError(403, 'Not enough balance');
  }
}

module.exports = {
  getProfileUnpaidJobs,
  payJob,
};
