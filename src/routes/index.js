const { Router } = require('express');

const router = Router();

const contractsRouter = require('./contracts');

router.use(contractsRouter);

module.exports = router;
