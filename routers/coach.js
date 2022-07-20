const {
    verifyTokenAdmin,
    verifyToken
  } = require('../middleware/verifyToken');
  const argon2 = require('argon2');
  const Coach = require('../models/Coach');
  const ObjectID = require('mongoose').Types.ObjectId;

  const router = require('express').Router();

  router.post('/addFavorites/:id', async (req, res) => {
    let {newFavorite} = req.body;
    const selectedId = req.params.id;
    if (!ObjectID.isValid(selectedId)) {
      return res.status(400).send('ID unknown : ' + selectedId);
    }
    const { favorites } = await Coach.findById(req.params.id);

  
    Coach.findOneAndUpdate(
      { _id: selectedId },
      {
        favorites: [...favorites, newFavorite],
      },
      { new: true, upsert: true }
    )
      .then((data) => {
        if (!data) {
          return res.status(404).json({
            message: `something went wong with new favorites!`,
          });
        } else res.status(200).json({ favorites: data.favorites });
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error updating favorites with id=' + id,
        });
      });
  });

  router.get('/', async (req, res) => {
    try {
      const coachs  = await Coach.find();
      res.status(200).json(coachs);
      
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const coach = await Coach.findById(req.params.id);
      const { password, ...others } = coach._doc;
  
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.put('/:id', verifyToken,  async (req, res) => {
    try {
      req.body.password = await argon2.hash(req.body.password);
      const updatedCoach = await Coach.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedCoach);
    } catch (err) {
      res.status(500).json(err);
      console.log(err)
    }
  });

  router.delete('/:id', verifyToken, async (req, res) => {
    try {
      await Coach.findByIdAndDelete(req.params.id);
      res.status(200).json("L'entraineur a bien été supprimé");
    } catch (err) {
      res.status(500).json(err);
    }
  });

  module.exports = router;