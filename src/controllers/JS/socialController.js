const SocialPost = require('../../models/mongo/socialPost');

// const { syncUserToMongo } = require('../../utils/userSync');

// exports.createPost = async (req, res) => {
//   console.log('POST /social/posts');
//   console.log('req.body:', req.body);
//   console.log('req.files:', req.files);
//   try {
//     const { content, isArticle, articleTitle, links = [] } = req.body;
//     const { userId } = req.user; // <-- Prend userId du token

//     // Convertir les liens en tableau si c'est une string
//     const linksArray = typeof links === 'string' ? [links] : links;

//     const post = new SocialPost({
//       content,
//       idUser: String(userId), // <-- Utilise userId ici
//       isArticle: !!isArticle,
//       ...(isArticle && { articleTitle }),
//       files: req.files?.map(file => ({
//         url: `/social/${file.filename}`,
//         type: file.mimetype.split('/')[0] === 'image' ? 'image' : 
//               file.mimetype.split('/')[0] === 'video' ? 'video' : 'file'
//       })) || [],
//       links: linksArray.filter(Boolean).map(url => ({ url })),
//       reactions: [], // <-- AJOUTE CETTE LIGNE
//       comments: []   // <-- AJOUTE CETTE LIGNE
//     });

//     await post.save();
//     res.status(201).json(post);
//   } catch (error) {
//     res.status(500).json({ 
//       error: 'Erreur création post',
//       details: error.message 
//     });
//   }
// };

exports.createPost = async (req, res) => {
  console.log('POST /social/posts');
  console.log('req.body:', req.body);
  
  try {
    const { content, isArticle, articleTitle,urlFile, links = [] , idUser} = req.body;

    // Convertir les liens en tableau si c'est une string
    const linksArray = typeof links === 'string' ? [links] : links;

    const post = new SocialPost({
      content,
      idUser: String(idUser), // <-- Utilise userId ici
      isArticle: !!isArticle,
      ...(isArticle && { articleTitle }),
      files: urlFile.filter(Boolean).map(url => ({ url })),
      links: linksArray.filter(Boolean).map(url => ({ url })),
      reactions: [], // <-- AJOUTE CETTE LIGNE
      comments: []   // <-- AJOUTE CETTE LIGNE
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ 
      error: 'Erreur création post',
      details: error.message 
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await SocialPost.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'users', // nom de la collection MongoDB (souvent 'users')
          localField: 'idUser',
          foreignField: 'idUser',
          as: 'user'
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          content: 1,
          idUser: 1,
          isArticle: 1,
          articleTitle: 1,
          files: 1,
          links: 1,
          createdAt: 1,
          updatedAt: 1,
          reactions: 1,
          comments: 1,
          user: {
            userName: 1,
            avatar: 1,
            surname: 1,
            roleUser: 1,
            statusUser: 1
          }
        }
      }
    ]);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ 
      error: 'Erreur récupération posts',
      details: error.message 
    });
  }
};

// POST /social/posts/:postId/reaction
exports.addReaction = async (req, res) => {
  try {
    const { postId } = req.params;
    const { type } = req.body;
    const userId = req.user.userId;
    const userName = req.user.userName;
    const avatar = req.user.avatar;
    const post = await SocialPost.findById(postId);
    if (!post) return res.status(404).json({ error: "Post non trouvé" });

    if (!post.reactions) post.reactions = [];
    const existingReaction = post.reactions.find(r => r.userId === userId);
    if (existingReaction) {
      existingReaction.types = type;
      existingReaction.userName = userName;
      existingReaction.avatar = avatar;
    } else {
      post.reactions.push({ userId, userName, avatar, types: type });
    }

    await post.save();
    res.json(post.reactions);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la réaction au post" });
  }
};

// POST /social/posts/:postId/comment
exports.addComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;
  console.log(userId)
  const userName = req.user.userName; 
  const avatar = req.user.avatar;
  const post = await SocialPost.findById(postId);
  post.comments.push({ userId, userName, content });
  await post.save();
  res.json(post.comments);
};

// POST /social/posts/:postId/comment/:commentId/reaction
exports.addCommentReaction = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { type } = req.body;
    const userId = req.user.userId;
    const userName = req.user.userName;
    const avatar = req.user.avatar;
    const post = await SocialPost.findById(postId);
    if (!post) return res.status(404).json({ error: "Post non trouvé" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Commentaire non trouvé" });

    if (!comment.reactions) comment.reactions = [];
    const existingReaction = comment.reactions.find(r => r.userId === userId);
    if (existingReaction) {
      existingReaction.types = type;
      existingReaction.userName = userName;
      existingReaction.avatar = avatar;
    } else {
      comment.reactions.push({ userId, userName, avatar, types: type });
    }

    await post.save();
    res.json(comment.reactions);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la réaction au commentaire" });
  }
};

exports.replyToComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;
    const userName = req.user.userName;
    const avatar = req.user.avatar;
    const post = await SocialPost.findById(postId);
    if (!post) return res.status(404).json({ error: "Post non trouvé" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Commentaire non trouvé" });

    comment.replies.push({
      userId,
      userName,
      avatar,
      content,
      createdAt: new Date()
    });

    await post.save();
    res.json(comment.replies);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la réponse au commentaire" });
  }
};

// Ajout d'une réaction à une réponse d'un commentaire
exports.addReplyReaction = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;
    const { type } = req.body;
    const userId = req.user.userId;
    const userName = req.user.userName;
    const avatar = req.user.avatar;
    const post = await SocialPost.findById(postId);
    if (!post) return res.status(404).json({ error: "Post non trouvé" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Commentaire non trouvé" });

    const reply = comment.replies.id(replyId);
    if (!reply) return res.status(404).json({ error: "Réponse non trouvée" });

    if (!reply.reactions) reply.reactions = [];
    const existingReaction = reply.reactions.find(r => r.userId === userId);
    if (existingReaction) {
      existingReaction.types = type;
      existingReaction.userName = userName;
      existingReaction.avatar = avatar;
    } else {
      reply.reactions.push({ userId, userName, avatar, types: type });
    }

    await post.save();
    res.json(reply.reactions);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la réaction à la réponse" });
  }
};