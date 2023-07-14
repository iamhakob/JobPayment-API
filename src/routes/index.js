const { Router } = require('express');

const router = Router();

const contractsRouter = require('./contracts');
const jobsRouter = require('./jobs');
const balancesRouter = require('./balances');
const adminRouter = require('./admin');

router.use(contractsRouter, jobsRouter, balancesRouter, adminRouter);

module.exports = router;
