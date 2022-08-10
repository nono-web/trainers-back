const router = require('express').Router();
const Coach = require('../models/Coach');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await argon2.hash(req.body.password);

    const newCoach = new Coach({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      club: req.body.club,
      phoneNumber: req.body.phoneNumber,
    });

    const savedCoach = await newCoach.save();
    res.status(201).json(savedCoach);
  } catch (err) {
    res.status(500).json("Une erreur s'est produite");
    console.log(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const coach = await Coach.findOne({ email: req.body.email });
    if (!coach) return res.status(400).json('Mauvais email ou Mot de passe');

    const validPassword = await argon2.verify(
      coach.password,
      req.body.password
    );
    if (!validPassword)
      return res.status(400).json('Mauvais email ou Mot de passe');

    const accessToken = jwt.sign(
      {
        id: coach._id,
        isAdmin: coach.isAdmin,
        username: coach.username,
        firstname : coach.firstname,
        lastname: coach.lastname
      },
      process.env.JWT_SEC,
      { expiresIn: '3d' }
    );

    const { password, ...others } = coach._doc;
    console.log('login', { ...others, accessToken });
      res.cookie('token', accessToken, {
        expires  : new Date(Date.now() + 9999999),
        httpOnly : true
      });
  
    res.status(200).json({
      isAdmin: others.isAdmin,
      favoritesExercices: others.favoritesExercices,
      id: others._id,
      username: others.username,
      firstname:others. firstname,
      lastname: others.lastname,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/logout', async (req, res) => {
  res
    .clearCookie('access_token')
    .status(200)
    .json({ message: 'Successfully logged out 😏 🍀' });
});

module.exports = router;
