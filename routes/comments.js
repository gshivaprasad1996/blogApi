const express = require('express');
const router = express.Router();
const CommentsController = require('../controllers/CommentsController')

router.get('/getCommentsByPostId', CommentsController.getcommentsByPostId)

router.post('/addComment', CommentsController.addComment)

router.put('/updateComment', CommentsController.updateComment)

router.delete('/deleteComment', CommentsController.deleteComment)


module.exports = router;