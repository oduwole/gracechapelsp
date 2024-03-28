var mongoose = require('mongoose');
var bookingSchema = mongoose.Schema({
    product: String,
    profileId: String,
    token: String,
    email: String,
    name: String,
    phoneNumber:String,
    sex:String,
    location:String,
    details:String,
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('bookings', bookingSchema);