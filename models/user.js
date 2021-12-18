const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

//adds a password and a username and a salt
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

