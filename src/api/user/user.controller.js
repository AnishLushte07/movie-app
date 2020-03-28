const _ = require('lodash');

const UserModel = require('./user.model');

async function login(req, res, next) {
    try {
        // Only POST via application/x-www-form-urlencoded is acceptable
        if (req.method !== 'POST' ||
            !req.is('application/x-www-form-urlencoded')) {
            return res.status(400).json({
                message:
                'Method must be POST with application/x-www-form-urlencoded encoding',
            });
        }

        const { email, password } = req.body;

        const user = await UserModel.findByCredential(email, password);

        const token = await user.generateToken();

        return res.json(token);
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    login,
};
