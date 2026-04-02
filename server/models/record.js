const mongoose = require('mongoose');

const recordSchema = mongoose.Schema({
    id: { type: String, required: true},
    vehicleId: { type: String, required: true},
    date: { type: Date, required: true},
    serviceType: { type: String, required: true},
    description: { type: String, required: true},
    mileage: { type: String, required: true},
    cost: { type: String, required: true}
});

module.exports = mongoose.model('Record', recordSchema);