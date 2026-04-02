const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema({
    id: { type: String, required: true},
    make: { type: String, required: true},
    model: { type: String, required: true},
    year: { type: String, required: true},
    mileage: { type: String, required: true},
    vin: { type: String, required: true}
});

module.exports = mongoose.model('Vehicle', vehicleSchema);