const {
  getProfileContractById,
  getProfileActiveContracts,
} = require('../services/contracts');
const ApiError = require('../apiError');

module.exports = {
  getProfileContract: async (req, res) => {
    const { id } = req.params;
    const profileId = req.profile.id;

    const contract = await getProfileContractById(id, profileId);

    if (!contract) throw new ApiError(404, 'no contract found');

    res.json(contract);
  },

  getProfileContracts: async (req, res) => {
    const profileId = req.profile.id;

    const contracts = await getProfileActiveContracts(profileId);

    res.json(contracts);
  },
};
