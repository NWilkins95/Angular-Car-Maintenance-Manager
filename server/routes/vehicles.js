var express = require('express');
var router = express.Router();

const Vehicle = require('../models/vehicle');

router.get('/', (req, res, next) => {
	Vehicle.find()
		.then((vehicles) => {
			res.status(200).json({
				message: 'Vehicles fetched successfully!',
				vehicles: vehicles
			});
		})
		.catch((error) => {
			res.status(500).json({
				message: 'An error occurred',
				error: error
			});
		});
});

router.post('/', (req, res, next) => {
	Vehicle.find({}, 'id')
		.then((vehicles) => {
			let maxVehicleId = 0;

			vehicles.forEach((existingVehicle) => {
				const currentId = Number(existingVehicle.id);
				if (currentId > maxVehicleId) {
					maxVehicleId = currentId;
				}
			});

			const vehicle = new Vehicle({
				id: String(maxVehicleId + 1),
				make: req.body.make,
				model: req.body.model,
				year: req.body.year,
				mileage: req.body.mileage,
				vin: req.body.vin
			});

			return vehicle.save();
		})
		.then((createdVehicle) => {
			res.status(201).json({
				message: 'Vehicle added successfully',
				vehicle: createdVehicle
			});
		})
		.catch((error) => {
			res.status(500).json({
				message: 'An error occurred',
				error: error
			});
		});
});

router.put('/:id', (req, res, next) => {
	Vehicle.findOne({ id: req.params.id })
		.then((vehicle) => {
			if (!vehicle) {
				return res.status(500).json({
					message: 'Vehicle not found.',
					error: { vehicle: 'Vehicle not found' }
				});
			}

			vehicle.make = req.body.make;
			vehicle.model = req.body.model;
			vehicle.year = req.body.year;
			vehicle.mileage = req.body.mileage;
			vehicle.vin = req.body.vin;

			Vehicle.updateOne({ id: req.params.id }, vehicle)
				.then((result) => {
					res.status(204).json({
						message: 'Vehicle updated successfully'
					});
				})
				.catch((error) => {
					res.status(500).json({
						message: 'An error occurred',
						error: error
					});
				});
		})
		.catch((error) => {
			res.status(500).json({
				message: 'Vehicle not found.',
				error: { vehicle: 'Vehicle not found' }
			});
		});
});

router.delete('/:id', (req, res, next) => {
	Vehicle.findOne({ id: req.params.id })
		.then((vehicle) => {
			if (!vehicle) {
				return res.status(500).json({
					message: 'Vehicle not found.',
					error: { vehicle: 'Vehicle not found' }
				});
			}

			Vehicle.deleteOne({ id: req.params.id })
				.then((result) => {
					res.status(204).json({
						message: 'Vehicle deleted successfully'
					});
				})
				.catch((error) => {
					res.status(500).json({
						message: 'An error occurred',
						error: error
					});
				});
		})
		.catch((error) => {
			res.status(500).json({
				message: 'Vehicle not found.',
				error: { vehicle: 'Vehicle not found' }
			});
		});
});

module.exports = router;
