
const mongoose = require('mongoose');

const ExerciceSchema = new mongoose.Schema(
  {
    coachId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    categoriesAge: {
      type: Array,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    typeTraining: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exercice', ExerciceSchema);