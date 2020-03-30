const _ = require('lodash');

const MovieModel = require('./movie.model');
const GenreModel = require('../genre/genre.model');

async function index(req, res, next) {
    try {
        const { genre, search, page, sort, order } = req.query;

        const query = Object.assign({
            deleted_on: null
        },
        genre ? { genre: { $in: genre.split(',') } } : {},
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

        const [movies, total] = await Promise.all([
            MovieModel.find(query)
                .skip((page - 1) * 10)
                .limit(10)
                .sort({ [sort]: order === 'asc' ? 1 : -1 }),
            MovieModel.count(query),
        ]);

        return res.json({ movies, total });
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

        if (body.new_genres) GenreModel.addNew(body.new_genres);

        return res.json();
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

        if (body.new_genres) GenreModel.addNew(body.new_genres);

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
