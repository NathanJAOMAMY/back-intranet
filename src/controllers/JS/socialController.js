let db;
const { ObjectID } = require("mongodb");

const init = (database) => {
  db = database;
};

// 🔹 Créer un post
exports.createPost = async (req, res) => {
  try {
    const { content, isArticle, articleTitle, urlFile = [], links = [], idUser } = req.body;

    const linksArray = typeof links === "string" ? [links] : links;

    const post = {
      content,
      idUser: String(idUser),
      isArticle: !!isArticle,
      ...(isArticle && { articleTitle }),
      files: urlFile.filter(Boolean).map(url => ({ url })),
      links: linksArray.filter(Boolean).map(url => ({ url })),
      reactions: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("socialPosts").insertOne(post);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    res.status(500).json({ error: "Erreur création post", details: error.message });
  }
};

// 🔹 Récupérer tous les posts avec infos utilisateur
exports.getPosts = async (req, res) => {
  try {
    const posts = await db.collection("socialPosts").aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "idUser",
          foreignField: "idUser",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
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
    ]).toArray();

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Erreur récupération posts", details: error.message });
  }
};

// 🔹 Ajouter une réaction à un post
exports.addReaction = async (req, res) => {
  try {
    const { postId } = req.params;
    const { type, userId } = req.body;

    const post = await db.collection("socialPosts").findOne({ _id: ObjectID(postId) });
    if (!post) return res.status(404).json({ error: "Post non trouvé" });

    post.reactions = post.reactions || [];
    const existing = post.reactions.find(r => r.userId === userId);
    if (existing) existing.types = type;
    else post.reactions.push({ userId, types: type });

    await db.collection("socialPosts").updateOne(
      { _id: ObjectID(postId) },
      { $set: { reactions: post.reactions, updatedAt: new Date() } }
    );

    res.json(post.reactions);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la réaction au post" });
  }
};

// 🔹 Ajouter un commentaire
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, userId } = req.body;

    const comment = { _id: new ObjectID(), userId, content, reactions: [], replies: [], createdAt: new Date() };

    await db.collection("socialPosts").updateOne(
      { _id: ObjectID(postId) },
      { $push: { comments: comment }, $set: { updatedAt: new Date() } }
    );

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout du commentaire" });
  }
};

// 🔹 Ajouter une réaction à un commentaire
exports.addCommentReaction = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { type, userId } = req.body;

    const post = await db.collection("socialPosts").findOne({ _id: ObjectID(postId) });
    if (!post) return res.status(404).json({ error: "Post non trouvé" });

    const comment = post.comments.find(c => c._id.toString() === commentId);
    if (!comment) return res.status(404).json({ error: "Commentaire non trouvé" });

    comment.reactions = comment.reactions || [];
    const existing = comment.reactions.find(r => r.userId === userId);
    if (existing) existing.types = type;
    else comment.reactions.push({ userId, types: type });

    await db.collection("socialPosts").updateOne(
      { _id: ObjectID(postId), "comments._id": ObjectID(commentId) },
      { $set: { "comments.$": comment, updatedAt: new Date() } }
    );

    res.json(comment.reactions);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la réaction au commentaire" });
  }
};

// 🔹 Répondre à un commentaire
exports.replyToComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { content, userId } = req.body;

    const reply = { _id: new ObjectID(), userId, content, reactions: [], createdAt: new Date() };

    await db.collection("socialPosts").updateOne(
      { _id: ObjectID(postId), "comments._id": ObjectID(commentId) },
      { $push: { "comments.$.replies": reply }, $set: { updatedAt: new Date() } }
    );

    res.json(reply);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la réponse au commentaire" });
  }
};

// 🔹 Ajouter une réaction à une réponse
exports.addReplyReaction = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;
    const { type, userId } = req.body;

    const post = await db.collection("socialPosts").findOne({ _id: ObjectID(postId) });
    if (!post) return res.status(404).json({ error: "Post non trouvé" });

    const comment = post.comments.find(c => c._id.toString() === commentId);
    if (!comment) return res.status(404).json({ error: "Commentaire non trouvé" });

    const reply = comment.replies.find(r => r._id.toString() === replyId);
    if (!reply) return res.status(404).json({ error: "Réponse non trouvée" });

    reply.reactions = reply.reactions || [];
    const existing = reply.reactions.find(r => r.userId === userId);
    if (existing) existing.types = type;
    else reply.reactions.push({ userId, types: type });

    await db.collection("socialPosts").updateOne(
      { _id: ObjectID(postId), "comments._id": ObjectID(commentId) },
      { $set: { "comments.$": comment, updatedAt: new Date() } }
    );

    res.json(reply.reactions);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la réaction à la réponse" });
  }
};

// 🔹 Modifier un post
exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, isArticle, articleTitle, links = [], urlFile = [] } = req.body;

    const linksArray = typeof links === "string" ? [links] : links;
    const files = urlFile.filter(Boolean).map(url => ({ url }));

    const updated = await db.collection("socialPosts").findOneAndUpdate(
      { _id: ObjectID(postId) },
      { $set: { content, isArticle: !!isArticle, articleTitle, files, links: linksArray, updatedAt: new Date() } },
      { returnOriginal: false }
    );

    if (!updated.value) return res.status(404).json({ error: "Post non trouvé" });
    res.json(updated.value);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la modification du post", details: error.message });
  }
};

// 🔹 Supprimer un post
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const deleted = await db.collection("socialPosts").deleteOne({ _id: ObjectID(postId) });

    if (deleted.deletedCount === 0) return res.status(404).json({ error: "Post non trouvé" });
    res.json({ message: "Post supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du post", details: error.message });
  }
};

module.exports.init = init;
