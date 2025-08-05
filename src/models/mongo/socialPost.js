const mongoose = require('mongoose');

// Supprime tous les modèles du cache Mongoose pour forcer la recompilation
if (mongoose.models.SocialPost) {
  delete mongoose.models.SocialPost;
}


const fileSchema = new mongoose.Schema({
  url: String,
  type: { type: String, enum: ['image', 'video', 'file'], default: 'file' }
});

const socialPostSchema = new mongoose.Schema({
  content: { type: String },
  idUser: { type: String, required: true },
  isArticle: { type: Boolean, default: false },
  articleTitle: String,
  files: [fileSchema],
  links: [{ url: String }],
  reactions: [
    {
      userId: String,
      userName: String, // <-- ajoute ceci
      avatar: String, // <-- ajoute ceci
      types: String
    }
  ],
  comments: [
    {
      userId: String,
      userName: String,
      avatar: String,
      content: String,
      createdAt: { type: Date, default: Date.now },
      reactions: [
        {
          userId: String,
          userName: String, // <-- ajoute ceci
          avatar: String, // <-- ajoute ceci
          types: String
        }
      ],
      replies: [
        {
          userId: String,
          userName: String,
          avatar: String,
          content: String,
          createdAt: { type: Date, default: Date.now },
          reactions: [
      {
        userId: String,
        userName: String, // <-- ajoute ceci
        avatar: String, // <-- ajoute ceci
        types: String
      }
    ]
        }
      ]
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('SocialPost', socialPostSchema);