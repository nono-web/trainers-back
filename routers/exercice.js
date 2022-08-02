const router = require('express').Router();
const { verifyToken, verifyTokenAdmin } = require('../middleware/verifyToken');
const Exercice = require('../models/Exercice');
const multer = require('multer');

const upload = multer({ dest: 'uploads/exercices' });

router.post('/', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
  try {
    await Exercice.findByIdAndDelete(req.params.id);
    res.status(200).json('L/"exercice a bien été supprimé');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/',  upload.single('img') , async (req, res) => {
  try {
    const [{ insertId: id }] = await new Exercice.save(req.body, req.file.path);
    return res.status(201).json({
      id,
      ...req.body,
     img: req.file.filename,
    });
  
  } catch (errors) {
    console.log(errors);
    return res.status(500).json({ errors });
  }
});

module.exports = router;
