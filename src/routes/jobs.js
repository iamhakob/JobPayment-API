const { Router } = require('express');
const { ensureClient } = require('../middleware');
const { payJob, getProfileUnpaidJobs } = require('../controllers/jobs');
const { validatePaymentInput } = require('../validators/jobs');

const router = Router();

router.get('/jobs/unpaid', getProfileUnpaidJobs);
router.post('/jobs/:job_id/pay', [ensureClient, validatePaymentInput], payJob);

module.exports = router;
