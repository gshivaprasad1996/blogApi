const CommentsModel = require('../models/CommentsModel')

module.exports = {
    getcommentsByPostId: async function(req, res, next){
        const comments = await CommentsModel.getcommentsByPostId(req.body)
        return res.json(comments)
    },
    addComment: async function(req, res, next){
        const comment = await CommentsModel.addComment(req.body)
        return res.json(comment)
    },
    updateComment: async function(req, res, next){
        const comment = await CommentsModel.updateComment(req.body)
        return res.json(comment)
    },
    deleteComment: async function(req, res, next){
        const result = await CommentsModel.deleteComment(req.body)
        return res.json(result)
    }
}