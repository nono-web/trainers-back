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
  try {
    const coachId = req.params.id;
    const { favoriteExId } = req.body;
    console.log('ccoach id', coachId);

    const { favoritesExercices } = await Coach.findById(coachId);

    if (!favoritesExercices) {
      return res
        .status(404)
        .json({ message: 'favoritesExercices doesn t exist' });
    }
    await Coach.findByIdAndUpdate(
      req.params.id,
      { $pull: { favoritesExercices: favoriteExId } },
      { safe: true, upsert: true }
    ).then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `Cannot remove favorite Exercice`,
        });
      } else {
        console.log(data);
        res.status(200).json({ response: favoriteExId });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: 'Too many favoritesExercices to remove.' });
  }
});

// get favorite exercices list

router.get('/favoritesExList/:coachId', async (req, res) => {
  const coachId = req.params.coachId;
  if (!ObjectID.isValid(coachId)) {
    return res.status(400).send('ID unknown : ' + coachId);
  }
  try {
    const { favoritesExercices } = await Coach.findById(coachId);

    res.status(200).json(favoritesExercices);
  } catch (err) {
    res.status(500).json({
      message: 'Coach id doesnt exist',
    });
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