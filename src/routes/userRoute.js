/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { UniqueConstraintError } = require("sequelize");
const jwt = require("jsonwebtoken");

const { User } = require("../db/sequelize");

// CRUD : Create Read Update Delete

// Create request
router.post("/", (req, res) => {
  const user = req.body;

  //Encrypter le mot de passe de l'utilisateur, afin de garantir sa sécurité
  bcrypt.hash(user.password, 10).then((hash) => {
    User.create({
      surname: user.surname,
      userName: user.userName,
      email: user.email,
      role: user.role,
      password: hash,
    })
      .then((users) => {
        const message = "Votre compte a été bien enregistré.";
        res.status(200).json({ message, data: users });
      })
      .catch((err) => {
        if (err instanceof UniqueConstraintError) {
          return res.status(400).json({
            message:
              "L'addresse email que vous essayer d'utiliser existe déjà.",
            data: err,
          });
        }
      });
  });
});

// Read request

// 1- Find all users
router.get("/allUser", (req, res) => {
  User.findAll().then((users) => {
    // const message = "Utilisateurs récupérés avec success";
    res.status(200).json(users);
  });
});

router.post("/login", (req, res) => {
  const userInfo = req.body;
  console.log(userInfo);

  return User.findOne({ where: { userName: userInfo.userName } })
    .then((user) => {
      if (!user) {
        const message = "Compte non disponible.";
        return res.status(404).json({ message });
      }

      bcrypt.compare(userInfo.password, user.password).then((correctPass) => {
        if (!correctPass) {
          const message = "Votre mot de passe n'est pas correcte.";
          return res.status(400).json({ message });
        }
        // JWT
        const token = jwt.sign(
          { 
          userId: user.idUser,
          userName: user.userName,
          avatar: user.avatar,
          // ...autres infos utiles
          }, "MY_PRIVATE_KEY", {
          expiresIn: "24h",
        });

        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: 3600000,
        });

        res.status(200).json({ user, token });
      });
    })
    .catch((err) => {
      const message = "Erreur de récupération de l'utilisateurs.";
      console.log(err);
      return res.status(500).json({ message });
    });
  //Encrypter le mot de passe de l'utilisateur, afin de garantir sa sécurité
  // bcrypt.hash(user.password,10)
  // .then(hash=>{
  //     User.create({
  //         name_surname : user.name_surname,
  //         username : user.username,
  //         email : user.email,
  //         role : user.role,
  //         password : hash
  //     })
  // .then(users=>{
  //     const message = 'Votre compte a été bien enregistré.'
  //     res.status(200).json({message, data:users})
  // })
  // .catch(err=>{
  //     if (err instanceof UniqueConstraintError){
  //         return res.status(400).json({message:"L'addresse email que vous essayer d'utiliser existe déjà.", data:err})
  //     }
  // })
  // })
});

// 2 - Find one users : gestion d'erreur finish
router.get("/:id", (req, res) => {
  User.findByPk(req.params.id)
    .then((user) => {
      if (!user) {
        const message =
          "L'utilisateurs que vous chercher à joindre n'existe pas.";
        return res.status(404).json({ message });
      }
      const message = `Utilisateur ${user.userName} bien récupéré`;
      res.status(200).json({ message, data: user });
    })
    .catch((error) => {
      const message =
        "Nous n'avons pas pu récupéré l'utilisateur, veillez réessayer ultérieurement.";
      res.status(500).json({ message, data: error });
    });
});

// Update request
// basic data : without password
router.put("/:id", (req, res) => {
  const id = req.params.id;
  //Encrypter le mot de passe de l'utilisateur, afin de garantir sa sécurité=
  User.update(req.body, {
    where: { id_user: id },
  }).then((_) => {
    return User.findByPk(id).then((user) => {
      if (!user) {
        const message =
          "L'utilisateurs que vous chercher à modifier n'existe pas.";
        return res.status(404).json({ message });
      }
      const message = `Utilisateur : ${user.userName} modifié`;
      res.status(200).json({ message, data: user });
    });
  });
});

// password only
router.put("/pass/:id", (req, res) => {
  const id = req.params.id;
  //Encrypter le mot de passe de l'utilisateur, afin de garantir sa sécurité=

  User.findOne({ where: { id_user: id } })
    .then((user) => {
      if (!user) {
        const message = "L'utilisateur n'existe pas";
        return res.status(404).json({ message });
      }
      bcrypt
        .compare(req.body.oldPass, user.password)
        .then((isOk) => {
          if (!isOk) {
            console.log("La comparaison a échoué !");
            return res
              .status(401)
              .json({ message: "Ancien mot de passe incorrect" });
          }

          bcrypt
            .hash(req.body.newPass, 10)
            .then((hashNewPass) => {
              user
                .update({ password: hashNewPass })
                .then((_) => {
                  const message = "Mot de passe mise à jour";
                  res.status(200).json({ message });
                })
                .catch((err) => {
                  const message =
                    "Erreur au niveau du serveur, veillez réessayer ultérieurement.";
                  res.status(500).json({ message, data: err });
                });
            })
            .catch((err) => {
              const message =
                "Erreur au niveau du serveur, veillez réessayer ultérieurement.";
              res.status(500).json({ message, data: err });
            });
        })
        .catch((err) => {
          const message =
            "Erreur au niveau du serveur, veillez réessayer ultérieurement.";
          res.status(500).json({ message, data: err });
        });
    })
    .catch((error) => {
      const message =
        "Erreur au niveau du serveur, veillez réessayer ultérieurement.";
      res.status(500).json({ message, data: error });
    });
});

// Delete request
router.delete("/:id", (req, res) => {
  User.findByPk(req.params.id)
    .then((user) => {
      if (user === null) {
        const message =
          "Utililisateur que vous voulez supprimer n'existe pas, veuillez reéssayer avec un autre.";
        return res.status(404).json({ message });
      }
      const userNameDeleted = user;

      return User.destroy({
        where: { id_user: user.id_user },
      }).then((_) => {
        const message = `${userNameDeleted.userName} à bien été supprimer de la base de données`;
        res.json({ message, data: userNameDeleted });
      });
    })
    .catch((error) => {
      const message =
        "Impossible de supprimer l'utilisateur en question, veuillez reéssayer ultérieurement.";
      res.status(500).json({ message, data: error });
    });
});

module.exports = router;
