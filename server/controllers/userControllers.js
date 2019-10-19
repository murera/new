
import joi from 'joi';
import UserModel from '../models/userModels';
import schema from '../middlewares/validations';


const userController = {
	async signup(req, res) {
		// joi validations
		// eslint-disable-next-line prefer-const
		const {
			email, firstName, lastName, phoneNumber, password
		} = req.body;

		const { error } = joi.validate({
			email, firstName, lastName, phoneNumber, password
		}, schema.user);
		if (error) {
			if (error.details[0].type === 'any.required') {
				return res.status(400).json({ status: 400, data: { error: 'All fields are required' } });
			} if (error.details[0].type === 'string.regex.base') {
				// eslint-disable-next-line prefer-template
				const err = error.details[0].message.split('with')[0] + ' is not valid';
				return res.status(400).json({ status: 400, data: error });
			}
			return res.status(400).json({ status: 400, data: { error: error.details[0].message } });
		}
		const { status, message,data } = await UserModel.signup(req.body);

		return res.status(status).json({ status, message, data });
	},

	async login(req, res) {
		const {
			email, password
		} = req.body;
		if (!email || !password) {
			return res.status(400).json({ status: 400, data: { error: 'All fields are required' } });
		}
		const { status, data } = await UserModel.login(req.body);
		return res.status(status).json({ status, data });
	}
};

export default userController;
