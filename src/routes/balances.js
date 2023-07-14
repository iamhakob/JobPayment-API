const { Router } = require('express');
const { ensureClient } = require('../middleware');
const { balanceDeposit, balanceTransfer } = require('../controllers/balances');
const { validateDepositInput } = require('../validators/balances');

const router = Router();

/*
    COPYING THE REQUIREMENTS FOR THIS ENDPOINT BELOW
    > POST /balances/deposit/:userId - Deposits money into the the the balance of a client,
    > a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)

    This was a bit confusing, who can deposit into the client's balance
    (necessarily a client, or a contractor as well?)
    Should depositing be a movement from one client's balance to another client's balance
    or simply increasing one client's account by some amount?

    I am assuming here the second case, since that's what I understood from the requirements.
    I will increase the amount of the client's (passed /:userId) no more
    than the 25% of his/her jobs left to pay
*/

router.post('/balances/deposit/:userId', validateDepositInput, balanceDeposit);

/*
    Also I would like to add one more route here (beyond the requirements)
    that would befave like the first case

    I will only let clients deposit money into the accounts of other clients from their own balance,
    and they can't deposit more than 25% of their total unpaid jobs

    I will name the endpoint /balances/transfer/:userId
*/

router.post('/balances/transfer/:userId', [ensureClient, validateDepositInput], balanceTransfer);

module.exports = router;