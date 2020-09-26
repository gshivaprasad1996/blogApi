const { MongoClient, ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');
const url = 'mongodb://localhost:27017/';
const client = new MongoClient(url, {
	useUnifiedTopology: true
});

module.exports = {
	login: async function(params) {
		let username = params.username;
		let password = params.password;
		try {
			await client.connect();
			const db = await client.db('blog');
			const collection = await db.collection('users');
			const result = await collection.findOne({
				username: username
			});
			if (result) {
				let compare = bcrypt.compareSync(
                        password,
                        result.password
                    );
				if (compare) {
					return await result;
				}
			}
		} finally {
			await client.close();
		}
	},
	signUp: async function(params) {
		const user = await params;
		console.log(user);
		let salt = await bcrypt.genSaltSync(10);
		let hashedPassword = await bcrypt.hashSync(
                user.password,
                salt
            );
		user.password = hashedPassword;
		try {
			await client.connect();
			const db = await client.db('blog');
			const collection = await db.collection('users');
			const result = await collection.insertOne(user);
			return await result;
		} finally {
			await client.close();
		}
	}
};
