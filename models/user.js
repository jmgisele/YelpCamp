const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Campground = require('./campground');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

//adds a password and a username and a salt
UserSchema.plugin(passportLocalMongoose);


UserSchema.virtual('numImagesUploaded').get( async function () {
    const id = this._id 
    const campgrounds = await Campground.find({author: id})
    let total = 0
    for (let camp of campgrounds) {
        const images = camp.images
        total += images.length
    }
    return total
})

module.exports = mongoose.model('User', UserSchema);

