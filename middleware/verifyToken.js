const jwt = require('jsonwebtoken');

require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authToken = req.cookies.token;
  console.log('cookies',req.cookies)
  if (!authToken) {
    return res.status(403).json({ message: 'Token is not valid!' });
  }
    jwt.verify(authToken, process.env.JWT_SEC, (err, coach) => {
      if (err) res.status(403).json({message: "You are not authenticated!"});
      req.coach = coach;
      next();
     
    });
  };
  
  const verifyTokenAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.coach.isAdmin) {
        next();
      } else {
        res.status(403).json("Vous n'êtes pas autorisé");
      }
    });
  };
  
  module.exports = { verifyToken, verifyTokenAdmin };

