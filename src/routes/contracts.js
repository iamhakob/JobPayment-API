const { Router } = require('express');
const {
  getProfileContract,
  getProfileContracts,
} = require('../controllers/contracts');
const { validateContractInput } = require('../validators/contracts');

const router = Router();

router.get('/contracts', getProfileContracts);
router.get('/contracts/:id', validateContractInput, getProfileContract);

module.exports = router;
