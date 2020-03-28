const _ = require('lodash');

const MovieModel = require('./movie.model');
const GenerModel = require('../gener/gener.model');

async function index(req, res, next) {
    try {
        const { genre, search } = req.query;

        const query = Object.assign({
            deleted_on: null
        },
        genre ? { genre: { $all: genre.split(',') } } : {},
        search 
            ? {
                $or: [{
                    name: { $regex: search, $options: 'i' }
                }, {
                    director: { $regex: search, $options: 'i' }
                }]
            }
            : {},
        );

        const movies = await MovieModel.find(query);

        return res.json(movies);
    } catch (err) {
        return next(err);
    }
}
async function create(req, res, next) {
    try {
        const body = req.body;
        const requiredKeys = ['imdb_score', 'director', 'genre', 'name', '99popularity'];

        const hasAll = _.every(requiredKeys, _.partial(_.has, body));
        
        if (!hasAll) return res.status(412).json({ message: 'Required fields missing' });

        await MovieModel.create(body);

        return res.sendStatus(201);
    } catch (err) {
        return next(err);
    }
}

async function remove(req, res, next) {
    try {
        const _id = req.params.id;

        await MovieModel.findByIdAndUpdate(
            { _id },
            {
                deleted_on: new Date(),
                deleted_by: 1,
            }
        );

        return res.sendStatus(204);
    } catch (err) {
        return next(err);
    }
}

async function update(req, res, next) {
    try {
        const _id = req.params.id;
        const body = req.body;

        const requiredKeys = ['imdb_score', 'director', 'genre', '99popularity'];
        const hasAll = _.every(requiredKeys, _.partial(_.has, body));

        if (!hasAll) return res.status(412).json({ message: 'Required fields missing' });

        await MovieModel.findByIdAndUpdate(
            { _id },
            _.pick(body, requiredKeys)
        );

        if (body.new_geners) GenerModel.addNew(body.new_geners);

        return res.sendStatus(204);
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    index,
    create,
    update,
    remove,
};
