const express = require('express');
const router = express.Router();
const PostsController = require('../controllers/PostsController')

/* GET home page. */
router.get('/', PostsController.getPosts)

router.get('/getPostById', PostsController.getPostById)

router.post('/createNewPost', PostsController.createNewPost)

router.put('/updatePost', PostsController.updatePost)

router.delete('/deletePost', PostsController.deletePost)

router.get('/getPostsByUser', PostsController.getPostsByUser)


module.exports = router;
