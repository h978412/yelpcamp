const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities');
const {descriptors,places} = require('./seedhelper');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('you are connected to mongodb');
});

const randarr = array => {
    return array[Math.floor(Math.random()* (array.length))]
}

const seeDB  = async()=>{
   await Campground.deleteMany({});
    for(let i=0;i<100;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new Campground ({
            author : '60e452260fe3e6480c1f564c',
            location : `${cities[random1000].city} ${cities[random1000].state}`,
            title : `${randarr(descriptors)} ${randarr(places)}`,
            price : Math.floor(Math.random()*50)+20,
            url:"https://source.unsplash.com/user/erondu",
            description:"We know that the first fibrous yacht is, in its own way, a blizzard. A spouseless basket is a celsius of the mind. A sandra can hardly be considered a stringent deposit without also being a bookcase. The french is a satin. What we don't know for sure is whether or not an unsliced squash without multi-hops is truly a fragrance of murky typhoons."
        });
        await camp.save();
    }
}
seeDB()
.then(()=>{
    mongoose.connection.close();
});