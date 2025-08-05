/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()

const {CodeInscription} = require('../db/sequelize')

router.post('/', (req, res)=>{
    const code = req.body
    console.log(code);
      

        CodeInscription.create({
            content_code : code.content_code,
        }) 
    .then(code=>{
        const message = 'Votre compte a été bien enregistré.'
        res.status(200).json({message, data:code})
    })
    .catch(err=>{
        res.status(500).json({err})
    }) 
   
}) 

router.get('/', (req,res)=>{
    CodeInscription.findAll()
    .then(code=>{
        const message = 'code recupérée avec success';
        res.status(200).json({message, data : code})
    })
})

router.get('/:id', (req,res)=>{
    CodeInscription.findByPk(req.params.id)
    .then(code=>{
        const message = 'code recupérée avec success';
        res.status(200).json({message, data : code})
    })
})

router.delete('/', async (req,res)=>{
    const {id} = req.query
    try {
        // Verifier si le code existe dans la base de donnée
        const code = await CodeInscription.findByPk(id)

        if(!code){
            return res.status(404).json({ message: 'code introuvable.' });
        }

        // Suppression du codes
        await CodeInscription.destroy({ where: { id_code: id } });
        return res.status(200).json({ message: 'code supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur suppression :', error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
    
})

module.exports = router