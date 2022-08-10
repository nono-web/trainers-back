const router = require('express').Router();
const {
  verifyToken
} = require('../middleware/verifyToken');
const TrainingPlane = require('../models/TrainingPlane');

router.post('/', verifyToken,async (req, res) => {
    const newTrainingPlane = new TrainingPlane(req.body);
    try {
      const savedTrainingPlane = await newTrainingPlane.save();
      res.status(200).json(savedTrainingPlane);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get('/', async (req, res) => {
    try {
      const trainingPlanes  = await TrainingPlane.find();
      res.status(200).json(trainingPlanes);
      
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.put('/:id', verifyToken, async (req, res) => {
    try {
      const updatedTrainingPlane = await TrainingPlane.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedTrainingPlane);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get('/:coachId', async (req, res) => {
    try {
      const trainingPlanes = await TrainingPlane.find({coachId : req.params.coachId});
      res.status(200).json(trainingPlanes);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get('/details/:id', async (req, res) => {
    try {
      const trainingPlanes = await TrainingPlane.findById( req.params.id);
  
      res.status(200).json(trainingPlanes);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.delete('/:id',verifyToken, async (req, res) => {
    try {
      await TrainingPlane.findByIdAndDelete(req.params.id);
      res.status(200).json('L/"entrainement a bien été supprimé');
    } catch (err) {
      res.status(500).json(err);
    }
  });

  module.exports = router;