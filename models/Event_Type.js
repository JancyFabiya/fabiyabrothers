const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventtypeSchema = new Schema({
    eventtype: String


})

const Event_Type = mongoose.model('Event_Type', EventtypeSchema)
module.exports = Event_Type
