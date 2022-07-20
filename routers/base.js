const router = require('express').Router();

router.get('/', (req, res) => {
  res.send("Bienvenue sur l'api Trainers");
});

module.exports = router;