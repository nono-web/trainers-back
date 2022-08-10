const jwt = require('jsonwebtoken');

require('dotenv').config();

const verifyToken = (req, res, next) => {
  const cookies = req.header.cookie || false;
  if (cookies) {
    let token = cookies
      .split(';')
      .find((c) => c.trim().startsWith('token='))
      .split('=')[1];
    if (token) {
      req.header.authorization = `Bearer ${token}`;
    }
  }
  next();
};
  
  module.exports = { verifyToken };

