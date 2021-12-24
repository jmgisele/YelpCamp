const AsyncErrorHandler = require('./AsyncErrorHandler');

let imgsAdded = 0
let imgsAllowed = 30
const validateImage = AsyncErrorHandler(async (req, file, cb) => {
    const imagesInMongo = await req.user.numImagesUploaded;
    imgsAdded++;
    if (imagesInMongo + imgsAdded > imgsAllowed) {
        cb(null, false)
        return cb(new Error(`Sorry, only ${imgsAllowed} images per user allowed right now! Delete some of the images you've uploaded and try again.`));
    } else if (file.mimetype !== "image/png" && file.mimetype !== "image/jpg" && file.mimetype !== "image/jpeg") {
        cb(null, false)
        return cb(new Error('Sorry, only pngs and jpg/jpeg image formats accepted. Please try again.'));
    } else {
        cb(null, true)
    }
})

module.exports = validateImage;