const mongoose = require('mongoose');

const TrainingPlaneSchema = new mongoose.Schema(
  {
    coachId: {
      type: String,
      required: true,
    },
    trainingName : {
      type: String,
      required: true,
    },
    exercices: [
      {
        exercicesId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    total_time : {
      type: Number
    },
    nbTotal_exercices : {
      type: Number
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TrainingPlane', TrainingPlaneSchema);
