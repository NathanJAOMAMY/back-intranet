/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()

const {createCodeInscription, getAllCodes, getSingleCode}  = require ('../controllers/codeController.js')

// const {CodeInscription} = require('../db/sequelize')

router.post('/', createCodeInscription) 

router.get('/', getAllCodes)

router.get('/:id', getSingleCode)

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