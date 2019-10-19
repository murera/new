
/* eslint-disable prefer-const */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-lone-blocks */
import Database from '../database/database';
import helper from '../middlewares/helpers';

class UserModel {
	async signup(details) {

		let {
			email, firstName, lastName, password
		} = details;
		let output;
		// check the existence
		const getUser = `SELECT * FROM users WHERE email = $1`;
		try {
			const rows = await Database.execute(getUser, [email]);
			if (rows[0]) {
				return { status: 409, data: { error: 'User already exist' } };
			}
		} catch (error) {
			return { status: 500, data: { error: 'intenal error' } };
		}

		const hashedPassword = helper.hashThePassword(password);
		const newUser = [firstName, lastName, email, hashedPassword];

		const createUser = `INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4) RETURNING *`;
		try {
			const rows = await Database.execute(createUser, newUser);
			
			//delete rows.password;
			output = rows[0];
		} catch (error) {
			return { status: 403, data: { error } };
		}

		const id = output.id;
		const { firstname, lastname,  createdon } = output;
		const payload = {
			id, firstname, lastname, email
		};
		const token = helper.getToken(payload);

		return { status: 201,message:"User created successfully",data: { token, id,firstname, lastname, createdon } };
	}

	async login({ email, password }) {
		// check if the user exist
		let output;
		let hashedPassword;
		const getUser = `SELECT * FROM users WHERE email = $1`;
		try {
			const rows = await Database.execute(getUser, [email]);
			if (!rows[0]) {
				return { status: 404, data: { error: 'User Not found' } };
			}
			hashedPassword = rows[0].password;
			output = rows[0];
		} catch (error) {
			return { status: 500, data: { error: 'something went wrong' } };
		}


		// check if the password matches
		if (!helper.checkThepassword(hashedPassword, password)) {
			return { status: 401, data: { error: 'The password is incorrect' } };
		}
		
		const { id, firstname, lastname,  createdon } = output;
		const token = helper.getToken({ id, firstname, lastname, email });
		return { status: 200, data: { token, id, firstname, lastname, email,  createdon } };
	}
}
export default new UserModel();
