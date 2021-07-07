const mongoose = require('mongoose');
const Review = require('./reviewes');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    location : String,
    title : String,
    price :Number,
    url : String,
    description: String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    review :[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
})

campgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
      await Review.deleteMany({_id:{$in:doc.review}})
    }
})

module.exports = mongoose.model('Campground',campgroundSchema);