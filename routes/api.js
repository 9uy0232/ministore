const express = require('express');
const rateLimit = require('express-rate-limit');

const apilimiter = rateLimit({
    windowMs: 1000 * 60 * 3, // 15 minutes
    max: 100,
    message: "You have exceeded the 100 requests in 3 minutes limit!",
});

const router = express.Router();
const customerController = require('../controllers/customers');

router.post('/customers', apilimiter, customerController.createCustomer);
router.put('/customers/:id', apilimiter, customerController.updateCustomer);
router.delete('/customers/:id', apilimiter, customerController.deleteCustomer);
router.get('/customers/:id', apilimiter, customerController.getCustomer);
router.get('/customers', apilimiter, customerController.getCustomers);

module.exports = router;