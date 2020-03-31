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
    created_by: { type: Schema.Types.ObjectId },
    created_on: { type: Date, default: Date.now },
    deleted_by: { type: Schema.Types.ObjectId },
    deleted_on: { type: Date, default: null },
    updated_by: { type: Schema.Types.ObjectId },
    updated_on: { type: Date, default: null },
}, options);

module.exports = mongoose.model('Movie', MovieSchema);
