const jwt = require('jsonwebtoken');

const UserModel = require('../api/user/user.model');
const { JWT_KEY } = require('../config/environment');

async function authenticate(req, res, next) {
    try {
        const token = (req.header('Authorization') || '')
            .replace('Bearer ', '');

        if (!token) return res.sendStatus(401);

        const data = jwt.verify(token, JWT_KEY);
        
        const user = await UserModel.count({ _id: data._id });

        if (!user) return res.sendStatus(401);

        next();
    } catch (err) {
        return res.sendStatus(401);
    }
}

module.exports = authenticate;