const PostsModel = require('../models/PostsModel')

module.exports = {
    getPosts: async function(req, res, next){
        const posts = await PostsModel.getPosts(req.body)
        return res.json(posts)
    },
    getPostById: async function(req, res, next){
        const post = await PostsModel.getPostById(req.body)
        return res.json(post)
    },
    createNewPost: async function(req, res, next){
        const post = await PostsModel.addNewPost(req.body)
        return res.json(post)
    },
    updatePost: async function(req,res,next){
        const post = await PostsModel.updatePost(req.body)
        return res.json(post)
    },
    deletePost: async function(req,res,next){
        const post = await PostsModel.deletePost(req.body)
        return res.json(post)
    },
    getPostsByUser: async function(req,res,next){
        const posts = await PostsModel.getPostsbyUser(req.body)
        return res.json(posts)
    }
}