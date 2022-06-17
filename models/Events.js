const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    // eventname:{
    //     type:Schema.Types.ObjectId,
    //     ref:'Event_name'
    // },
    eventname: String,
    description: String,
    image: String,
    amount: Number,
    eventtype: String,
    // eventtype:{
    //     type:Schema.Types.ObjectId,
    //     ref:'Event_Type',

    // }



})

const Event = mongoose.model('Event', EventSchema)
module.exports = Event
