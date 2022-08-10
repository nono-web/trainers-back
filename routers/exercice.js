const router = require('express').Router();
const { verifyToken } = require('../middleware/verifyToken');
const Exercice = require('../models/Exercice');
const multer = require('multer');

const upload = multer({ dest: 'uploads/exercices' });

router.post('/',verifyToken, async (req, res) => {
  const newExercice = new Exercice(req.body);
  try {
    const savedExercice = await newExercice.save();
    res.status(200).json(savedExercice);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const exercices = await Exercice.find();
    res.status(200).json(exercices);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updatedExercice = await Exercice.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedExercice);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const exercice = await Exercice.findById(req.params.id);

    res.status(200).json(exercice);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id',verifyToken, async (req, res) => {
  try {
    const refreshExerciceList = await Exercice.findByIdAndDelete(req.params.id);
    res.status(200).json(refreshExerciceList);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
