/**
 * @model gener
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const options = {
    versionKey : false,
};

const GenerSchema = new Schema({
    name: { type : String },
	created_on: { type: Date, default: Date.now },
}, options);

GenerSchema.statics.addNew = async (geners) => {
    Gener.create(geners.map(v => ({ name: v })));
}

const Gener = mongoose.model('Gener', GenerSchema);

module.exports = Gener;