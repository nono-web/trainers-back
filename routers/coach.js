const { verifyTokenAdmin, verifyToken } = require('../middleware/verifyToken');
const argon2 = require('argon2');
const Coach = require('../models/Coach');
const ObjectID = require('mongoose').Types.ObjectId;

const router = require('express').Router();

router.post('/favoritesExercices/:id', async (req, res) => {
  let { newFavoriteExId } = req.body;
  const coachId = req.params.id;
  if (!ObjectID.isValid(coachId)) {
    return res.status(400).send('ID unknown : ' + coachId);
  }
  const { favoritesExercices } = await Coach.findById(req.params.id);

  Coach.findOneAndUpdate(
    { _id: coachId },
    {
      favoritesExercices: [...favoritesExercices, newFavoriteExId],
    },
    { new: true, upsert: true }
  )
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          message: `something went wong with new favorites!`,
        });
      } else res.status(200).json({ response: newFavoriteExId });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Error updating favoritesExercices with id=' + id,
      });
    });
});

router.post('/removeOneFavoriteExe/:id', async (req, res) => {
  const coachId = req.params.id;
  const { favoriteExId } = req.body;
  console.log('favoriteExId', favoriteExId);

  const { favoritesExercices } = await Coach.findById(coachId);

  console.log('favorites Exercices', favoritesExercices);

  if (!favoritesExercices) {
    return res
      .status(404)
      .json({ message: 'favoritesExercices doesn t exist' });
  }

  try {
    await Coach.findOneAndUpdate(
      { _id: coachId },
      { $pull: { favoritesExercices: { _id: ObjectID(favoriteExId) } } }
    ).then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `Cannot remove favorite Exercice`,
        });
      } else res.status(200).json({ response: favoriteExId });
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: 'Too many favoritesExercices to remove.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const coachs = await Coach.find();
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

router.put('/:id', verifyToken, async (req, res) => {
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
    console.log(err);
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