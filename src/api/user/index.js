const express = require('express');
const controller = require('./user.controller');
const authenticate = require('../../components/authenticate');

const router = express.Router();

router.post('/', authenticate, controller.create);
router.post('/login', controller.login);

module.exports = router;
