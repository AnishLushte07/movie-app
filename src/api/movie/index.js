const express = require('express');
const controller = require('./movie.controller');
const authenticate = require('../../components/authenticate');

const router = express.Router();

router.get('/', controller.index);

router.use(authenticate);

router.post('/', controller.create);

router.put('/:id', controller.update);

router.delete('/:id', controller.remove);

module.exports = router;
