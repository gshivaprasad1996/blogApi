const { MongoClient, ObjectID } = require('mongodb');
const url = 'mongodb://localhost:27017/';
const client = new MongoClient(url, {
	useUnifiedTopology: true
});

module.exports = {
	getcommentsByPostId: async function(params) {
		try {
			await client.connect();
			const db = await client.db('blog');
			const postsCollection = await db.collection('posts');
			const result = await postsCollection.aggregate([
				{
					$lookup: {
						from: 'comments',
						localField: 'comments',
						foreignField: '_id',
						as: 'comments_info'
					}
                },
                {
                    $match: {
                        _id: ObjectID(`${params.postId}`)
                    }
                }
            ])

            const comments = []
            await result.forEach((val)=>{
                comments.push(val.comments_info)
            })
            return await comments[0]
		} finally {
			await client.close();
		}
	},
	addComment: async function(params) {
		try {
			await client.connect();
			const db = await client.db('blog');
			const postsCollection = await db.collection('posts');
			const commentsCollection = await db.collection('comments');

			const post = await postsCollection.findOne({ _id: ObjectID(params.postId) });
			if (post) {
				const result = await commentsCollection.insertOne(params);
				if (result) {
					const options = { upsert: true };
					const updateQuery = { $set: { comments: [ ...post.comments, result.ops[0]._id ] } };
					const postUpdated = await postsCollection.updateOne(
						{ _id: ObjectID(params.postId) },
						updateQuery,
						options
					);
					if (postUpdated) {
						return await result.ops;
					}
				}
			}
		} finally {
			await client.close();
		}
	},
	updateComment: async function(params) {
        const commentId = params._id;
		const commentBody = params.body;
		try {
			await client.connect();
			const db = await client.db('blog');
			const collection = await db.collection('comments');
			const query = { _id: ObjectID(commentId) };
			const options = { upsert: true };
			const updateQuery = { $set: commentBody };
			const result = await collection.updateOne(query, updateQuery, options);
			console.log(await result.matchedCount);
			return await result;
		} finally {
			await client.close();
		}
    },
	deleteComment: async function(params) {
        const commentId = params.commentId;
		try {
			await client.connect();
			const db = await client.db('blog');
			const collection = await db.collection('comments');
			const query = { _id: ObjectID(commentId) };
			const result = await collection.deleteOne(query);
			return await result.ops;
		} finally {
			await client.close();
		}
    }
};
