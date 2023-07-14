const { Router } = require('express');

const router = Router();

const contractsRouter = require('./contracts');
const jobsRouter = require('./jobs');

router.use(contractsRouter, jobsRouter);

module.exports = router;
