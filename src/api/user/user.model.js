/**
 * @model gener
 */

const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { JWT_KEY, SALT } = require('../../config/environment');
const Schema = mongoose.Schema;

const options = {
    versionKey : false,
};

const UserSchema = new Schema({
    name: { type : String },
    email: { type : String },
    password: { type : String },
	created_on: { type : Date, default: Date.now },
}, options);


UserSchema.methods.generateToken = async function() {
    const user = this;
    
    return jwt.sign({ _id: user._id }, JWT_KEY);
}

UserSchema.statics.findByCredential = async (email, pass) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid Credentials');
    }

    const hashedPass = crypto.createHash('md5')
        .update(SALT + pass)
        .digest('hex');

    if (hashedPass !== user.password) {
        throw new Error('Invalid Credentials');
    }

    return user;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;