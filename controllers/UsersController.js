const jwt = require('jsonwebtoken');
const UsersModel = require('../models/UsersModel');
const requiredFields = [ 'emailAddress', 'username', 'password', 'fullname' ];
let missedFields = [];

const validateFields = function(user) {
	requiredFields.forEach((value) => {
		if (!user.hasOwnProperty(value)) {
			missedFields.push(value);
		}
	});
};

module.exports = {
	login: async function(req, res, next) {
		let result = await UsersModel.login(req.body);
		return res.send({
			user: result
		});
	},
	signUp: async function(req, res, next) {
		await validateFields(req.body);
		if (missedFields.length > 0) {
			return res.send({
				message: 'Missing required fields',
				fields: missedFields
			});
		} else {
			let user = await UsersModel.signUp(req.body);
			if (user) {
				let token = jwt.sign(
					{
						username: user.ops.username
					},
					'secretKey'
				);
				return res.json({
					user: user.ops,
					token: token
				});
			}
		}
	}
};
