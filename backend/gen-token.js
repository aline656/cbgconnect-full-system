const jwt = require('jsonwebtoken');
const JWT_SECRET = 'change-this-secret';
const token = jwt.sign(
  { sub: '3', email: 'secretary@gmail.com', role: 'secretary' },
  JWT_SECRET,
  { expiresIn: '7d' }
);
console.log(token);
