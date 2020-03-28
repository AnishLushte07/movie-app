/**
 * @model movies
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const options = {
    versionKey : false,
};

const MovieSchema = new Schema({
    imdb_score: { type : Schema.Types.Decimal128 },
	'99popularity': { type : Schema.Types.Decimal128 },
	director: { type : String },
	genre: { type : Array },
    name: { type: String },
    deleted_on: { type: Date, default: null },
    deleted_by: { type: Schema.Types.Number },
}, options);

module.exports = mongoose.model('Movie', MovieSchema);
