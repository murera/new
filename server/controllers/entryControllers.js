import joi from 'joi';
import entryModel from '../models/entryModels'
import schema from '../middlewares/validations';

const entryController = {
	async create(req, res) {
		const details = req.body;
		const {
			title, description
		} = details;
		const { error } = joi.validate({
			title, description
		}, schema.entry);
		if (error) {
		
			return res.status(400).json({status: 400, data: {error: error.details[0].message }});
		}
		const { status, message,data } = await entryModel.create(req);
		res.status(status).json({ status, message,data });
	},

	async findOne(req, res) {
		const { status, data } = await entryModel.findOne(req,req.params.id);
		res.status(status).json({ status, data });
	},
	async findAll(req, res) {
		const { status, data } = await entryModel.findAll(req);
		res.status(status).json({ status, data });
	},

	

	async delete(req, res) {
		const { status, data } = await entryModel.delete(req);
		res.status(status).json({ status, data });
	},

	async update(req, res) {
		const { status,message, data } = await entryModel.update(req);
		res.status(status).json({ status,message, data });
	},

	
};
export default entryController;
