const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = ((arr) => arr[Math.floor(Math.random() * arr.length)]);

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '61be24a00550e0acfaad30e8',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    "url": "https://res.cloudinary.com/dugpy1adl/image/upload/v1640134065/YelpCamp/uo3ahcxmwyeichcndgli.jpg",
                    "filename": "YelpCamp/uo3ahcxmwyeichcndgli"
                }
            ],
            description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis deleniti facilis repellendus? Sapiente maiores rem saepe tempora eos dicta consequatur minima vitae. Dolor tempora alias facilis sed labore iure tenetur.`,
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});