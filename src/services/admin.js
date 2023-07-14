const { Op } = require('sequelize');
const {
  Contract, Profile, Job, sequelize,
} = require('../model');

async function getBestProfession(start, end) {
  const jobs = await Job.findAll({
    where: {
      paid: true,
      [Op.and]: [
        { createdAt: { [Op.gt]: start } },
        { paymentDate: { [Op.lt]: end } },
      ],
    },
    attributes: [
      [sequelize.fn('sum', sequelize.col('price')), 'total'],
      [sequelize.col('Contract.Contractor.profession'), 'profession'],
    ],
    order: [['total', 'DESC']],
    group: ['profession'],
    include: [
      {
        model: Contract,
        attributes: [],
        include: [
          {
            model: Profile,
            as: 'Contractor',
            where: { type: 'contractor' },
            attributes: [],
          },
        ],
      },
    ],
    limit: 1,
  });

  if (!jobs.length) {
    return null;
  }

  // raw since raw: true flag above in the query
  const rawResult = jobs[0];
  return rawResult;
}

async function getBestClients(start, end, limit) {
  return Job.findAll({
    where: {
      paid: true,
      [Op.and]: [
        { createdAt: { [Op.gt]: start } },
        { paymentDate: { [Op.lt]: end } },
      ],
    },
    attributes: [
      [sequelize.fn('sum', sequelize.col('price')), 'totalPaid'],
    ],
    order: [['totalPaid', 'DESC']],
    group: ['Contract.Client.id'],
    include: [
      {
        model: Contract,
        as: 'Contract',
        attributes: [],
        include: [
          {
            model: Profile,
            as: 'Client',
            where: { type: 'client' },
            attributes: [],
          },
        ],
      },
    ],
    limit,
  });
}

module.exports = {
  getBestProfession,
  getBestClients,
};
