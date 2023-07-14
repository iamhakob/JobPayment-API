const { Router } = require('express');

const router = Router();

const contractsRouter = require('./contracts');
const jobsRouter = require('./jobs');
const balancesRouter = require('./balances');

router.use(contractsRouter, jobsRouter, balancesRouter);

module.exports = router;
