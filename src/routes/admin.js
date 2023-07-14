const { Router } = require('express');
const { getBestProfession, getBestClients } = require('../controllers/admin');
const { validateBestProfessionInput, validateBestClientsInput } = require('../validators/admin');

const router = Router();

/**
 * Here could have been another middleware checking if this is an admin calling.
 * Since we have no method to authorize admins,
 * I am just leaving this with getProfile, so anyone can call this
 */
router.get('/admin/best-profession', validateBestProfessionInput, getBestProfession);
router.get('/admin/best-clients', validateBestClientsInput, getBestClients);

module.exports = router;