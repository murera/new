import joi from 'joi';

const schema = {
	entry: joi.object().keys({
		title: joi.string().min(5).max(50).trim().required(),
		description: joi.string().min(10).trim().required()
	
	}),
	user: joi.object().keys({
		firstName: joi.string().min(2).trim().required(),
		lastName: joi.string().min(2).trim().required(),
		email: joi.string().email().trim().required(),
		phoneNumber: joi.string().trim().optional(), // +threedigits-sixto12digits
		password: joi.string().required()
	})

	
};

export default schema;
