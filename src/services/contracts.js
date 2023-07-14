const { Op } = require('sequelize');
const { Contract } = require('../model');

async function getProfileContractById(id, profileId) {
  return Contract.findOne({
    where: {
      id,
      [Op.or]: [
        {
          ClientId: profileId,
        },
        {
          ContractorId: profileId,
        },
      ],
    },
  });
}

async function getProfileActiveContracts(profileId) {
  return Contract.findAll({
    where: {
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
  });
}

module.exports = {
  getProfileContractById,
  getProfileActiveContracts,
};
