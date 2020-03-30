/**
 * @model gener
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const options = {
    versionKey : false,
};

const GenreSchema = new Schema({
    name: { type : String },
	created_on: { type: Date, default: Date.now },
}, options);

GenreSchema.statics.addNew = async (genres) => {
    Genre.create(genres.map(v => ({ name: v.trim() })));
}

const Genre = mongoose.model('Genre', GenreSchema);

module.exports = Genre;