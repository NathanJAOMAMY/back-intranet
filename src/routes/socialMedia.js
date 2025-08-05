const express = require('express');
const router = express.Router();
const socialController = require('../controllers/JS/socialController');
const upload = require('../middlewares/upload');
const authMiddleware = require('../middlewares/auth');

router.post('/posts', 
  authMiddleware, 
  upload.array('files', 10), // Max 10 fichiers
  socialController.createPost
);

router.get('/posts', socialController.getPosts);
router.post('/posts/:postId/reaction', authMiddleware, socialController.addReaction);
router.post('/posts/:postId/comment', authMiddleware, socialController.addComment);
router.post('/posts/:postId/comment/:commentId/reaction', authMiddleware, socialController.addCommentReaction);
router.post('/posts/:postId/comment/:commentId/reply', authMiddleware, socialController.replyToComment);
router.post(
  '/posts/:postId/comment/:commentId/reply/:replyId/reaction',
  authMiddleware,
  socialController.addReplyReaction
);

module.exports = router;