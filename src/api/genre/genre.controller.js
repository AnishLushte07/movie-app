const _ = require('lodash');

const GenreModel = require('./genre.model');

async function index(req, res, next) {
    try {
        const genres = await GenreModel.find();

        return res.json(genres.map(v => v.name));
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    index,
};
