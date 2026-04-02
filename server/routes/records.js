var express = require('express');
var router = express.Router();

const Record = require('../models/record');

router.get('/', (req, res, next) => {
	Record.find()
		.then((records) => {
			res.status(200).json({
				message: 'Records fetched successfully!',
				records: records
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
	Record.find({}, 'id')
		.then((records) => {
			let maxRecordId = 0;

			records.forEach((existingRecord) => {
				const currentId = Number(existingRecord.id);
				if (currentId > maxRecordId) {
					maxRecordId = currentId;
				}
			});

			const record = new Record({
				id: String(maxRecordId + 1),
				vehicleId: req.body.vehicleId,
				date: req.body.date,
				serviceType: req.body.serviceType,
				description: req.body.description,
				cost: req.body.cost
			});

			return record.save();
		})
		.then((createdRecord) => {
			res.status(201).json({
				message: 'Record added successfully',
				record: createdRecord
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
	Record.findOne({ id: req.params.id })
		.then((record) => {
			if (!record) {
				return res.status(500).json({
					message: 'Record not found.',
					error: { record: 'Record not found' }
				});
			}

			record.vehicleId = req.body.vehicleId;
			record.date = req.body.date;
			record.serviceType = req.body.serviceType;
			record.description = req.body.description;
			record.cost = req.body.cost;

			Record.updateOne({ id: req.params.id }, record)
				.then((result) => {
					res.status(204).json({
						message: 'Record updated successfully'
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
				message: 'Record not found.',
				error: { record: 'Record not found' }
			});
		});
});

router.delete('/:id', (req, res, next) => {
	Record.findOne({ id: req.params.id })
		.then((record) => {
			if (!record) {
				return res.status(500).json({
					message: 'Record not found.',
					error: { record: 'Record not found' }
				});
			}

			Record.deleteOne({ id: req.params.id })
				.then((result) => {
					res.status(204).json({
						message: 'Record deleted successfully'
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
				message: 'Record not found.',
				error: { record: 'Record not found' }
			});
		});
});

module.exports = router;
