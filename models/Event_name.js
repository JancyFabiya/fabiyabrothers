const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventnameSchema = new Schema({
    eventname: String


})

const Event_name = mongoose.model('Event_name', EventnameSchema)
module.exports = Event_name
