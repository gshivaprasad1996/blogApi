const { MongoClient, ObjectID } = require('mongodb');
const url = 'mongodb://localhost:27017/';
const client = new MongoClient(url, {
	useUnifiedTopology: true
});

module.exports = {
	getPosts: async function(params) {
		try {
			await client.connect();
			const db = await client.db('blog');
			const collection = await db.collection('posts');
			const result = await collection.find({});
			let posts = [];
			await result.forEach((data) => {
				posts.push(data);
			});
			return await posts;
		} finally {
			await client.close();
		}
	},
	getPostsbyUser: async function(params){
		console.log(params)
		try {
			await client.connect();
			const db = await client.db('blog');
			const collection = await db.collection('posts');
			const query = { userId: params.userId };
			const options = {
				sort: { rating: -1 },
				projection: { _id: 0, name: 1, age: 1 }
			};
			const result = await collection.find(query);
			let posts = [];
			await result.forEach((data) => {
				posts.push(data);
			});
			return await posts;
		} finally {
			await client.close();
		}
	},
	getPostById: async function(params) {
		const postId = params._id;
		try {
			await client.connect();
			const db = await client.db('blog');
			const collection = await db.collection('posts');
			const query = { _id: ObjectID(postId) };
			const options = {
				sort: { rating: -1 },
				projection: { _id: 0, name: 1, age: 1 }
			};
			const result = await collection.findOne(query, options);
			return await result;
		} finally {
			await client.close();
		}
	},
	addNewPost: async function(params) {
		let post = params.post;
		let userId = params.userId;
		post.userId = userId
		try {
			await client.connect();
			const db = await client.db('blog');
			const postsCollection = await db.collection('posts');
			const userCollection = await db.collection('users');
			const user = await userCollection.findOne({ _id: ObjectID(userId) });
			if (user) {
				const result = await postsCollection.insertOne(post);
				if (result) {
					const options = { upsert: true };
					const updateQuery = { $set: { posts: [ ...user.posts, result.ops[0]._id ] } };
					const userUpdated = await userCollection.updateOne(
						{ _id: ObjectID(user._id) },
						updateQuery,
						options
					);
					if (userUpdated) {
						return await result.ops;
					}
				}
			}
		} finally {
			await client.close();
		}
	},
	updatePost: async function(params) {
		const postId = params._id;
		const postBody = params.body;
		try {
			await client.connect();
			const db = await client.db('blog');
			const collection = await db.collection('posts');
			const query = { _id: ObjectID(postId) };
			const options = { upsert: true };
			const updateQuery = { $set: postBody };
			const result = await collection.updateOne(query, updateQuery, options);
			console.log(await result.matchedCount);
			return await result;
		} finally {
			await client.close();
		}
	},
	deletePost: async function(params) {
		const postId = params._id;
		try {
			await client.connect();
			const db = await client.db('blog');
			const collection = await db.collection('posts');
			const query = { _id: ObjectID(postId) };
			const result = await collection.deleteOne(query);
			return await result.ops;
		} finally {
			await client.close();
		}
	}
};
